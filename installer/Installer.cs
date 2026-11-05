using System;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

[assembly: AssemblyTitle("Vencord Expression Picker Enhanced Setup")]
[assembly: AssemblyDescription("Installer and uninstaller for Vencord Expression Picker Enhanced")]
[assembly: AssemblyProduct("Vencord Expression Picker Enhanced")]
[assembly: AssemblyCompany("quentingimenez")]
[assembly: AssemblyVersion("1.7.0.0")]
[assembly: AssemblyFileVersion("1.7.0.0")]

namespace VencordExpressionPickerEnhanced.Setup
{
    internal static class Program
    {
        [STAThread]
        private static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            if (args != null && args.Length > 0)
            {
                string mode = args[0].ToLowerInvariant();
                if (mode == "--install-silent")
                {
                    Environment.Exit(Installer.Install(Console.WriteLine));
                }
                if (mode == "--uninstall-silent")
                {
                    Environment.Exit(Installer.Uninstall(Console.WriteLine));
                }
            }

            Application.Run(new InstallerForm());
        }
    }

    internal static class Installer
    {
        public const string AppName = "Vencord Expression Picker Enhanced";
        public const string RepositoryUrl = "https://github.com/quentingimenez/vencord-expression-picker-enhanced";

        public static string AppVersion
        {
            get
            {
                Version version = Assembly.GetExecutingAssembly().GetName().Version;
                return version == null ? "0.0.0" : version.ToString(3);
            }
        }
        private const string UninstallKey = @"Software\Microsoft\Windows\CurrentVersion\Uninstall\VencordExpressionPickerEnhanced";
        private const string InstallFolderName = "VencordPickerResize";

        public static string RoamingAppData
        {
            get { return GetPath("APPDATA", Environment.SpecialFolder.ApplicationData); }
        }

        public static string LocalAppData
        {
            get { return GetPath("LOCALAPPDATA", Environment.SpecialFolder.LocalApplicationData); }
        }

        public static string InstallDir
        {
            get { return Path.Combine(LocalAppData, InstallFolderName); }
        }

        public static string PowerShellPath
        {
            get
            {
                string windows = Environment.GetEnvironmentVariable("SystemRoot");
                if (String.IsNullOrEmpty(windows))
                {
                    windows = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                }
                return Path.Combine(windows, "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
            }
        }

        public static bool IsInstalled()
        {
            return File.Exists(Path.Combine(InstallDir, "picker-resize.js"));
        }

        public static int Install(Action<string> log)
        {
            string temp = null;
            try
            {
                string preload = Path.Combine(RoamingAppData, "Vencord", "dist", "preload.js");
                if (!File.Exists(preload))
                {
                    Log(log, "Vencord was not found at:");
                    Log(log, "  " + preload);
                    Log(log, "Install Vencord desktop first.");
                    return 2;
                }

                temp = ExtractPayload();
                Log(log, "Installing " + AppName + " " + AppVersion + "...");
                int exitCode = RunPowerShell(Path.Combine(temp, "install.ps1"), temp, log);
                if (exitCode != 0)
                {
                    Log(log, "Installation failed (exit code " + exitCode + ").");
                    return 1;
                }

                string iconSource = Path.Combine(temp, "app.ico");
                if (File.Exists(iconSource))
                {
                    Directory.CreateDirectory(InstallDir);
                    File.Copy(iconSource, Path.Combine(InstallDir, "app.ico"), true);
                }

                WriteUninstallEntry();
                Log(log, "Installation complete.");
                Log(log, "Restart Discord to activate the module.");
                return 0;
            }
            catch (Exception ex)
            {
                Log(log, "Error: " + ex.Message);
                return 1;
            }
            finally
            {
                DeleteDirectory(temp);
            }
        }

        public static int Uninstall(Action<string> log)
        {
            string temp = null;
            try
            {
                temp = ExtractPayload();
                Log(log, "Uninstalling " + AppName + "...");
                int exitCode = RunPowerShell(Path.Combine(temp, "uninstall.ps1"), temp, log);
                if (exitCode != 0)
                {
                    Log(log, "Uninstall failed (exit code " + exitCode + ").");
                    return 1;
                }
                RemoveUninstallEntry();
                Log(log, "Uninstall complete.");
                Log(log, "Restart Discord to finish.");
                return 0;
            }
            catch (Exception ex)
            {
                Log(log, "Error: " + ex.Message);
                return 1;
            }
            finally
            {
                DeleteDirectory(temp);
            }
        }

        private static string GetPath(string variable, Environment.SpecialFolder folder)
        {
            string value = Environment.GetEnvironmentVariable(variable);
            if (!String.IsNullOrEmpty(value))
            {
                return value;
            }
            return Environment.GetFolderPath(folder);
        }

        private static void WriteUninstallEntry()
        {
            string uninstallScript = Path.Combine(InstallDir, "uninstall.ps1");
            string uninstallCommand = "\"" + PowerShellPath + "\" -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"" + uninstallScript + "\"";

            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(UninstallKey))
            {
                if (key == null)
                {
                    return;
                }
                key.SetValue("DisplayName", AppName);
                key.SetValue("DisplayVersion", AppVersion);
                key.SetValue("Publisher", "quentingimenez");
                key.SetValue("InstallLocation", InstallDir);
                key.SetValue("DisplayIcon", Path.Combine(InstallDir, "app.ico"));
                key.SetValue("UninstallString", uninstallCommand);
                key.SetValue("QuietUninstallString", uninstallCommand);
                key.SetValue("URLInfoAbout", RepositoryUrl);
                key.SetValue("NoModify", 1, RegistryValueKind.DWord);
                key.SetValue("NoRepair", 1, RegistryValueKind.DWord);
            }
        }

        private static void RemoveUninstallEntry()
        {
            try
            {
                Registry.CurrentUser.DeleteSubKeyTree(UninstallKey, false);
            }
            catch
            {
            }
        }

        private static int RunPowerShell(string script, string workingDirectory, Action<string> log)
        {
            ProcessStartInfo startInfo = new ProcessStartInfo(PowerShellPath);
            startInfo.Arguments = "-NoProfile -ExecutionPolicy Bypass -File \"" + script + "\"";
            startInfo.WorkingDirectory = workingDirectory;
            startInfo.UseShellExecute = false;
            startInfo.CreateNoWindow = true;
            startInfo.RedirectStandardOutput = true;
            startInfo.RedirectStandardError = true;

            using (Process process = new Process())
            {
                process.StartInfo = startInfo;
                process.OutputDataReceived += delegate(object sender, DataReceivedEventArgs e)
                {
                    if (e.Data != null)
                    {
                        Log(log, e.Data);
                    }
                };
                process.ErrorDataReceived += delegate(object sender, DataReceivedEventArgs e)
                {
                    if (e.Data != null)
                    {
                        Log(log, e.Data);
                    }
                };

                process.Start();
                process.BeginOutputReadLine();
                process.BeginErrorReadLine();
                // The parameterless overload also waits for the asynchronous
                // stdout/stderr handlers to flush before returning.
                process.WaitForExit();
                return process.ExitCode;
            }
        }

        private static string ExtractPayload()
        {
            string root = Path.Combine(Path.GetTempPath(), "VencordExpressionPickerEnhanced-" + Guid.NewGuid().ToString("N"));
            string sourceDir = Path.Combine(root, "src");
            Directory.CreateDirectory(sourceDir);
            WriteResource("payload.install.ps1", Path.Combine(root, "install.ps1"));
            WriteResource("payload.uninstall.ps1", Path.Combine(root, "uninstall.ps1"));
            WriteResource("payload.picker-resize.js", Path.Combine(sourceDir, "picker-resize.js"));
            WriteResource("payload.watcher.ps1", Path.Combine(sourceDir, "watcher.ps1"));
            WriteResource("payload.app.ico", Path.Combine(root, "app.ico"));
            return root;
        }

        private static void WriteResource(string name, string path)
        {
            using (Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(name))
            {
                if (stream == null)
                {
                    throw new InvalidOperationException("Missing embedded resource: " + name);
                }
                using (FileStream file = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    stream.CopyTo(file);
                }
            }
        }

        private static void DeleteDirectory(string path)
        {
            if (String.IsNullOrEmpty(path))
            {
                return;
            }
            try
            {
                if (Directory.Exists(path))
                {
                    Directory.Delete(path, true);
                }
            }
            catch
            {
            }
        }

        private static void Log(Action<string> log, string message)
        {
            if (log != null)
            {
                log(message);
            }
        }
    }

    internal sealed class InstallerForm : Form
    {
        private readonly bool french;
        private readonly Label statusLabel;
        private readonly TextBox logBox;
        private readonly Button installButton;
        private readonly Button uninstallButton;
        private readonly Button closeButton;
        private bool busy;

        public InstallerForm()
        {
            french = CultureInfo.CurrentUICulture.TwoLetterISOLanguageName == "fr";

            Text = Installer.AppName;
            StartPosition = FormStartPosition.CenterScreen;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            ShowIcon = true;
            AutoScaleMode = AutoScaleMode.Dpi;
            ClientSize = new Size(660, 500);
            BackColor = Color.FromArgb(245, 246, 248);
            Font = new Font("Segoe UI", 9F);

            try
            {
                Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
            }
            catch
            {
            }

            Panel header = new Panel();
            header.Dock = DockStyle.Top;
            header.Height = 88;
            header.BackColor = Color.FromArgb(88, 101, 242);

            Label title = new Label();
            title.Text = Installer.AppName;
            title.ForeColor = Color.White;
            title.Font = new Font("Segoe UI", 16F, FontStyle.Bold);
            title.AutoSize = false;
            title.Location = new Point(20, 16);
            title.Size = new Size(620, 30);
            header.Controls.Add(title);

            Label subtitle = new Label();
            subtitle.Text = L("Installateur et désinstalleur", "Installer and uninstaller");
            subtitle.ForeColor = Color.FromArgb(230, 232, 255);
            subtitle.Font = new Font("Segoe UI", 9.5F);
            subtitle.AutoSize = false;
            subtitle.Location = new Point(22, 50);
            subtitle.Size = new Size(620, 20);
            header.Controls.Add(subtitle);

            Controls.Add(header);

            statusLabel = new Label();
            statusLabel.AutoSize = false;
            statusLabel.Location = new Point(20, 100);
            statusLabel.Size = new Size(620, 20);
            statusLabel.ForeColor = Color.FromArgb(60, 64, 72);
            Controls.Add(statusLabel);

            logBox = new TextBox();
            logBox.Multiline = true;
            logBox.ReadOnly = true;
            logBox.ScrollBars = ScrollBars.Vertical;
            logBox.Location = new Point(20, 126);
            logBox.Size = new Size(620, 270);
            logBox.BackColor = Color.White;
            logBox.ForeColor = Color.FromArgb(45, 48, 55);
            logBox.Font = new Font("Consolas", 9F);
            logBox.BorderStyle = BorderStyle.FixedSingle;
            Controls.Add(logBox);

            LinkLabel link = new LinkLabel();
            link.Text = "GitHub";
            link.AutoSize = true;
            link.Location = new Point(20, 410);
            link.LinkColor = Color.FromArgb(88, 101, 242);
            link.ActiveLinkColor = Color.FromArgb(71, 82, 196);
            link.LinkClicked += delegate
            {
                try
                {
                    Process.Start(new ProcessStartInfo(Installer.RepositoryUrl) { UseShellExecute = true });
                }
                catch
                {
                }
            };
            Controls.Add(link);

            Label versionLabel = new Label();
            versionLabel.Text = "v" + Installer.AppVersion;
            versionLabel.AutoSize = false;
            versionLabel.TextAlign = ContentAlignment.MiddleRight;
            versionLabel.Location = new Point(520, 408);
            versionLabel.Size = new Size(120, 20);
            versionLabel.ForeColor = Color.FromArgb(110, 115, 125);
            Controls.Add(versionLabel);

            installButton = new Button();
            installButton.Text = L("Installer", "Install");
            installButton.Location = new Point(20, 440);
            installButton.Size = new Size(150, 36);
            installButton.Click += delegate { RunOperation(false); };
            Controls.Add(installButton);

            uninstallButton = new Button();
            uninstallButton.Text = L("Désinstaller", "Uninstall");
            uninstallButton.Location = new Point(180, 440);
            uninstallButton.Size = new Size(150, 36);
            uninstallButton.Click += delegate { RunOperation(true); };
            Controls.Add(uninstallButton);

            closeButton = new Button();
            closeButton.Text = L("Fermer", "Close");
            closeButton.Location = new Point(540, 440);
            closeButton.Size = new Size(100, 36);
            closeButton.Click += delegate { Close(); };
            Controls.Add(closeButton);

            AcceptButton = installButton;
            CancelButton = closeButton;
            FormClosing += OnFormClosing;
            Load += delegate
            {
                AppendLog(Installer.AppName + " " + Installer.AppVersion);
                RefreshState();
                AppendLog("");
            };
        }

        private string L(string frenchText, string englishText)
        {
            return french ? frenchText : englishText;
        }

        private void RunOperation(bool uninstall)
        {
            if (busy)
            {
                return;
            }

            SetBusy(true);
            AppendLog("");
            AppendLog(uninstall ? L("Désinstallation...", "Uninstalling...") : L("Installation...", "Installing..."));

            Thread thread = new Thread(delegate()
            {
                int exitCode = uninstall ? Installer.Uninstall(AppendLog) : Installer.Install(AppendLog);
                BeginInvoke(new Action(delegate()
                {
                    SetBusy(false);
                    RefreshState();
                    if (exitCode == 0)
                    {
                        string message = uninstall
                            ? L("Désinstallation terminée. Redémarre Discord.", "Uninstall complete. Restart Discord.")
                            : L("Installation terminée. Redémarre Discord.", "Installation complete. Restart Discord.");
                        MessageBox.Show(this, message, Installer.AppName, MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    else
                    {
                        string message = L("L'opération a échoué. Consulte le journal.", "The operation failed. Check the log.");
                        MessageBox.Show(this, message, Installer.AppName, MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }));
            });
            thread.IsBackground = true;
            thread.Start();
        }

        private void SetBusy(bool value)
        {
            busy = value;
            installButton.Enabled = !value;
            uninstallButton.Enabled = !value && Installer.IsInstalled();
            closeButton.Enabled = !value;
            Cursor = value ? Cursors.WaitCursor : Cursors.Default;
        }

        private void RefreshState()
        {
            bool installed = Installer.IsInstalled();
            installButton.Text = installed
                ? L("Réinstaller", "Reinstall")
                : L("Installer", "Install");
            uninstallButton.Enabled = installed && !busy;
            statusLabel.Text = installed
                ? L("Installé. Tu peux réinstaller ou désinstaller.", "Installed. You can reinstall or uninstall.")
                : L("Non installé.", "Not installed.");
        }

        private void AppendLog(string line)
        {
            if (logBox.InvokeRequired)
            {
                logBox.BeginInvoke(new Action<string>(AppendLog), new object[] { line });
                return;
            }
            logBox.AppendText(line + Environment.NewLine);
            logBox.SelectionStart = logBox.TextLength;
            logBox.ScrollToCaret();
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            if (busy)
            {
                e.Cancel = true;
                MessageBox.Show(this, L("Une opération est en cours.", "An operation is in progress."), Installer.AppName, MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }
    }
}
