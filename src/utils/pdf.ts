import jsPDF from 'jspdf';
import { User } from '../types/user';
import { Person } from '../types/person';

type ExportItem = User | Person | User[] | Person[];

export function generatePDF(item: ExportItem) {
  const pdf = new jsPDF();
  
  // Add header
  pdf.setFontSize(20);
  pdf.setTextColor(79, 70, 229); // Indigo color
  pdf.text('Agile Finance', 20, 20);
  
  if (Array.isArray(item)) {
    // Handle array of items (Users or People)
    const items = item as (User[] | Person[]);
    const isUsers = 'email' in items[0];
    
    pdf.setFontSize(16);
    pdf.setTextColor(0);
    pdf.text(isUsers ? 'Relatório de Usuários' : 'Relatório de Pessoas', 20, 40);
    
    // Add summary
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    
    const total = items.length;
    let y = 60;
    
    if (isUsers) {
      const users = items as User[];
      const activeUsers = users.filter(u => u.status === 'active').length;
      const inactiveUsers = total - activeUsers;
      
      pdf.text(`Total de usuários: ${total}`, 20, y);
      pdf.text(`Usuários ativos: ${activeUsers}`, 20, y + 10);
      pdf.text(`Usuários inativos: ${inactiveUsers}`, 20, y + 20);
      y += 40;
      
      // Add user list
      users.forEach((user, index) => {
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
        y += 15;
      });
    } else {
      const people = items as Person[];
      const pf = people.filter(p => p.person_type_description === 'Pessoa Física').length;
      const pj = total - pf;
      
      pdf.text(`Total de registros: ${total}`, 20, y);
      pdf.text(`Pessoas Físicas: ${pf}`, 20, y + 10);
      pdf.text(`Pessoas Jurídicas: ${pj}`, 20, y + 20);
      y += 40;
      
      // Add people list
      people.forEach((person, index) => {
        if (y > pdf.internal.pageSize.height - 40) {
          pdf.addPage();
          y = 20;
        }
        
        pdf.setFont(undefined, 'bold');
        pdf.text(`${index + 1}. ${person.full_name}`, 20, y);
        y += 10;
        
        pdf.setFont(undefined, 'normal');
        if (person.fantasy_name) {
          pdf.text(`Nome Fantasia: ${person.fantasy_name}`, 30, y);
          y += 7;
        }
        pdf.text(`Tipo: ${person.person_type_description}`, 30, y);
        y += 7;
        
        const docs = person.documents.map(d => `${d.document_type}: ${d.document_value}`).join(', ');
        pdf.text(`Documentos: ${docs}`, 30, y);
        y += 7;
        
        const contacts = person.contacts.map(c => `${c.contact_type}: ${c.contact_value}`).join(', ');
        pdf.text(`Contatos: ${contacts}`, 30, y);
        y += 15;
      });
    }
  } else {
    // Handle single item (User or Person)
    const isUser = 'email' in item;
    
    pdf.setFontSize(16);
    pdf.setTextColor(0);
    pdf.text(isUser ? 'Detalhes do Usuário' : 'Detalhes da Pessoa', 20, 40);
    
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    let y = 60;
    
    if (isUser) {
      const user = item as User;
      pdf.setFont(undefined, 'bold');
      pdf.text(user.name, 20, y);
      y += 10;
      
      pdf.setFont(undefined, 'normal');
      pdf.text(`E-mail: ${user.email}`, 20, y);
      y += 7;
      pdf.text(`Função: ${user.role}`, 20, y);
      y += 7;
      pdf.text(`Status: ${user.status === 'active' ? 'Ativo' : 'Inativo'}`, 20, y);
    } else {
      const person = item as Person;
      pdf.setFont(undefined, 'bold');
      pdf.text(person.full_name, 20, y);
      y += 10;
      
      pdf.setFont(undefined, 'normal');
      if (person.fantasy_name) {
        pdf.text(`Nome Fantasia: ${person.fantasy_name}`, 20, y);
        y += 7;
      }
      pdf.text(`Tipo: ${person.person_type_description}`, 20, y);
      y += 7;
      
      const docs = person.documents.map(d => `${d.document_type}: ${d.document_value}`).join(', ');
      pdf.text(`Documentos: ${docs}`, 20, y);
      y += 7;
      
      const contacts = person.contacts.map(c => `${c.contact_type}: ${c.contact_value}`).join(', ');
      pdf.text(`Contatos: ${contacts}`, 20, y);
    }
  }
  
  // Add footer
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  const today = new Date().toLocaleDateString('pt-BR');
  pdf.text(`Gerado em ${today} - Agile Finance`, 20, pdf.internal.pageSize.height - 20);
  
  // Save the PDF
  const filename = Array.isArray(item) 
    ? (('email' in item[0]) ? 'relatorio-usuarios.pdf' : 'relatorio-pessoas.pdf')
    : (('email' in item) ? 'usuario.pdf' : 'pessoa.pdf');
  
  pdf.save(filename);
}