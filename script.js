// Small niceties only — the site works fully without JS.
document.getElementById("year").textContent = new Date().getFullYear();

var toggle = document.getElementById("navToggle");
var nav = document.getElementById("nav");
toggle.addEventListener("click", function () {
  nav.classList.toggle("open");
});
nav.addEventListener("click", function (e) {
  if (e.target.tagName === "A") nav.classList.remove("open");
});

/* ---------- Interactive terminal: fixed built-in commands only.
   No free-text input is accepted anywhere — visitors can only run
   the commands below, exactly as listed by `help`. ---------- */
(function () {
  var screen = document.getElementById("termScreen");
  var chipsBox = document.getElementById("termChips");
  if (!screen || !chipsBox) return;

  var COMMANDS = {
    "help": [
      "Available commands:",
      "  help               show this list",
      "  whoami             who is Dhoni?",
      "  ls                 list files in this directory",
      "  ls -la             same list, with details",
      "  about              short bio",
      "  skills             tools and skills",
      "  experience         internship history",
      "  projects           things he has built",
      "  contact            where to reach him",
      "  resume             download the resume (PDF)",
      "  clear              clear the terminal"
    ],
    "whoami": [
      "Dhoni Kumar Shah",
      "Cybersecurity Intern — VAPT & Web Application Security",
      "New Delhi, India · BCA @ IGNOU · Diploma in Cybersecurity @ MMIIT",
      "Currently: Cybersecurity Intern @ NetworkWalks"
    ],
    "ls": [
      "about  skills  experience  projects  contact  resume.pdf"
    ],
    "ls -la": [
      "total 96",
      "-rw-r--r-- 1 mrhackoi mrhackoi   612 Nov 23 08:00 about",
      "-rw-r--r-- 1 mrhackoi mrhackoi   845 Nov 23 08:00 skills",
      "-rw-r--r-- 1 mrhackoi mrhackoi  1204 Nov 23 08:00 experience",
      "-rw-r--r-- 1 mrhackoi mrhackoi   977 Nov 23 08:00 projects",
      "-rw-r--r-- 1 mrhackoi mrhackoi   388 Nov 23 08:00 contact",
      "-rw-r--r-- 1 mrhackoi mrhackoi 70486 Nov 23 08:00 resume.pdf"
    ],
    "about": [
      "BCA student (IGNOU) + Diploma in Cybersecurity (MMIIT).",
      "7 internships in VAPT & web app security.",
      "Loves breaking web apps — and documenting how to fix them.",
      "Home lab + TryHackMe / Hack The Box (20+ rooms)."
    ],
    "skills": [
      "tools  : Nmap, Burp Suite, ZAP, Wireshark, Nessus, Metasploit",
      "vapt   : OWASP Top 10, SQLi, XSS, CSRF, LFI, Command Injection",
      "network: TCP/IP, DNS, Subnetting, Firewalls, Traffic Analysis",
      "code   : Python, Bash, JavaScript, SQL"
    ],
    "experience": [
      "Oct 2026 - Present  Cybersecurity Intern        NetworkWalks",
      "Oct 2026            Cybersecurity Intern        Horizon TechX",
      "Oct 2026            Cybersecurity Intern        CyberSNova",
      "Oct 2026            AI Cybersecurity Intern     EWB Edutech",
      "Sep 2026            VAPT Intern                 Trios Cyber",
      "Sep 2026            Web App Pentesting Intern   IqraSec Academy",
      "Aug 2026            Cyber Security Intern       Redynox"
    ],
    "projects": [
      "Network Toolkit      Python + Scapy network toolkit (CLI + GUI)",
      "Secure Coding Review Flask app audit — tests 6/6 passing",
      "Phishing URL Checker Python CLI flagging phishing signals",
      "Home Lab             Kali / Win Server / DVWA / Juice Shop range",
      "",
      "Full code on GitHub: github.com/mrhackoi"
    ],
    "contact": [
      "LinkedIn : linkedin.com/in/dhoni-shah",
      "GitHub   : github.com/mrhackoi",
      "TryHackMe: tryhackme.com/p/MrHackoi",
      "Email    : use the Contact Me button in the contact section",
      "",
      "Open to: Full-time · Part-time · Remote · Contract"
    ],
    "resume": [
      "Downloading Dhoni_Kumar_Shah_Resume.pdf ..."
    ]
  };
  COMMANDS["ls -ll"] = COMMANDS["ls -la"];

  var PROMPT_1 = "┌──(mrhackoi㉿kali)-[~]";
  var PROMPT_2 = "└─$ ";
  var busy = false;

  function el(cls, text) {
    var d = document.createElement("div");
    d.className = cls;
    d.textContent = text;
    return d;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function scrollDown() { screen.scrollTop = screen.scrollHeight; }

  async function typeCommand(cmd) {
    screen.appendChild(el("t-line t-prompt", PROMPT_1));
    var line = el("t-line", "");
    var cmdSpan = document.createElement("span");
    cmdSpan.className = "t-cmd";
    line.appendChild(document.createTextNode(PROMPT_2));
    line.appendChild(cmdSpan);
    screen.appendChild(line);
    scrollDown();
    for (var i = 0; i < cmd.length; i++) {
      cmdSpan.textContent += cmd[i];
      await sleep(26);
    }
    await sleep(120);
  }

  async function run(cmd) {
    if (busy) return;
    busy = true;
    var buttons = chipsBox.querySelectorAll("button");
    buttons.forEach(function (b) { b.disabled = true; });
    if (cmd === "clear") {
      await typeCommand(cmd);
      screen.innerHTML = "";
    } else {
      await typeCommand(cmd);
      var out = COMMANDS[cmd] || ["command not found"];
      for (var j = 0; j < out.length; j++) {
        screen.appendChild(el("t-line t-out", out[j]));
        scrollDown();
        await sleep(34);
      }
      if (cmd === "resume") {
        var a = document.createElement("a");
        a.href = "Resume%20PDF.pdf";
        a.setAttribute("download", "");
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    }
    screen.appendChild(el("t-line", ""));
    scrollDown();
    buttons.forEach(function (b) { b.disabled = false; });
    busy = false;
  }

  chipsBox.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) run(b.getAttribute("data-cmd"));
  });

  // Boot sequence: whoami, then a hint to try help.
  (async function () {
    await run("whoami");
    screen.appendChild(el("t-line t-dim", "Tip: click [ help ] above to see everything this terminal can do."));
    scrollDown();
  })();
})();
