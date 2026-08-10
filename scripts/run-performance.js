const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const testPlan = path.join(projectRoot, 'performance', 'booking_load_test.jmx');
const results = path.join(projectRoot, 'performance', 'results.jtl');
const report = path.join(projectRoot, 'performance', 'reports', 'html-report');

fs.mkdirSync(path.dirname(results), { recursive: true });
fs.rmSync(results, { force: true });
fs.rmSync(report, { recursive: true, force: true });
fs.mkdirSync(report, { recursive: true });

const args = ['-n', '-t', testPlan, '-l', results, '-e', '-o', report];
const candidates = process.platform === 'win32'
  ? [
      process.env.JMETER_JAR,
      'C:\\apache-jmeter-5.6.3\\bin\\ApacheJMeter.jar',
      'C:\\tools\\apache-jmeter-5.6.2\\bin\\ApacheJMeter.jar'
    ].filter(Boolean)
  : [];

let command;
let commandArgs;

if (process.platform === 'win32') {
  const jar = candidates.find((candidate) => fs.existsSync(candidate));
  if (!jar) {
    console.error('JMeter no encontrado. Define JMETER_JAR o instala Apache JMeter.');
    process.exit(1);
  }
  command = process.env.JAVA_HOME
    ? path.join(process.env.JAVA_HOME, 'bin', 'java.exe')
    : 'java';
  commandArgs = ['-jar', jar, ...args];
} else {
  command = 'jmeter';
  commandArgs = args;
}

const result = spawnSync(command, commandArgs, {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: false
});

if (result.error) {
  console.error(`No fue posible iniciar JMeter: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
