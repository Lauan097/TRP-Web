import { spawn } from 'child_process';

console.log('Iniciando servidor versão 0.1.1...');

spawn('npm', ['run', 'start'], { 
  stdio: 'inherit',
  shell: true 
});