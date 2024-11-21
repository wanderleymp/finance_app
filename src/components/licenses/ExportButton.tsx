import { useState } from 'react';
import { FileSpreadsheet, Share2, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { License } from '../../types/license';
import { generatePDF } from '../../utils/pdf';
import { toast } from 'sonner';

interface ExportButtonProps {
  licenses: License[];
}

export function ExportButton({ licenses }: ExportButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const exportData = licenses.map(license => ({
        Nome: license.license_name,
        Descrição: license.description || '',
        Preço: `R$ ${license.price.toFixed(2)}`,
        Status: license.status === 'active' ? 'Ativa' : 'Inativa',
        'Máximo de Usuários': license.max_users || 'Ilimitado',
        'Duração (meses)': license.duration_months,
        'Data de Criação': new Date(license.created_at).toLocaleDateString('pt-BR'),
        'Última Atualização': new Date(license.updated_at).toLocaleDateString('pt-BR')
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Licenças');
      
      XLSX.writeFile(wb, 'licencas.xlsx');
      toast.success('Relatório Excel exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Erro ao exportar relatório Excel');
    } finally {
      setIsExporting(false);
      setShowDropdown(false);
    }
  };

  const exportToPDF = () => {
    try {
      generatePDF(licenses);
      toast.success('Relatório PDF exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Erro ao exportar relatório PDF');
    } finally {
      setShowDropdown(false);
    }
  };

  const shareReport = () => {
    const text = `Relatório de Licenças - Continuing with the license management system implementation...

<boltArtifact id="license-crud-system-continued" title="License Management System (Continued)">
<boltAction type="file" filePath="src/components/licenses/ExportButton.tsx">Agile Finance\n\nTotal de licenças: ${licenses.length}\nLicenças ativas: ${licenses.filter(l => l.status === 'active').length}\nLicenças inativas: ${licenses.filter(l => l.status === 'inactive').length}\nValor total: R$ ${licenses.reduce((acc, l) => acc + l.price, 0).toFixed(2)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Relatório de Licenças - Agile Finance',
        text: text,
      }).catch(console.error);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Exportar
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <button
              onClick={exportToExcel}
              disabled={isExporting}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </button>
            <button
              onClick={shareReport}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}