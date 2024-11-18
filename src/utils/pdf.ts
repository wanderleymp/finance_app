import jsPDF from 'jspdf';
import { User } from '../types/user';

export function generatePDF(users: User | User[]) {
  const pdf = new jsPDF();
  const userArray = Array.isArray(users) ? users : [users];
  
  // Add header
  pdf.setFontSize(20);
  pdf.setTextColor(79, 70, 229); // Indigo color
  pdf.text('Agile Finance', 20, 20);
  
  pdf.setFontSize(16);
  pdf.setTextColor(0);
  pdf.text('Relatório de Usuários', 20, 40);
  
  // Add summary
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  
  const totalUsers = userArray.length;
  const activeUsers = userArray.filter(u => u.status === 'active').length;
  const inactiveUsers = totalUsers - activeUsers;
  
  pdf.text(`Total de usuários: ${totalUsers}`, 20, 60);
  pdf.text(`Usuários ativos: ${activeUsers}`, 20, 70);
  pdf.text(`Usuários inativos: ${inactiveUsers}`, 20, 80);
  
  // Add user list
  let y = 100;
  userArray.forEach((user, index) => {
    if (y > pdf.internal.pageSize.height - 40) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFont(undefined, 'bold');
    pdf.text(`${index + 1}. ${user.name}`, 20, y);
    y += 10;
    
    pdf.setFont(undefined, 'normal');
    pdf.text(`E-mail: ${user.email}`, 30, y);
    y += 7;
    pdf.text(`Função: ${user.role}`, 30, y);
    y += 7;
    pdf.text(`Status: ${user.status === 'active' ? 'Ativo' : 'Inativo'}`, 30, y);
    y += 7;
    pdf.text(`Último Acesso: ${new Date(user.lastAccess).toLocaleString('pt-BR')}`, 30, y);
    y += 15;
  });
  
  // Add footer
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  const today = new Date().toLocaleDateString('pt-BR');
  pdf.text(`Gerado em ${today} - Agile Finance`, 20, pdf.internal.pageSize.height - 20);
  
  // Save the PDF
  pdf.save('relatorio-usuarios.pdf');
}