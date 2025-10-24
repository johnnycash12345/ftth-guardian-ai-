import type { ModelMetrics, Prediction, FeatureImportance } from '../types';

// Let TypeScript know about the global variables from the script tags
declare const jspdf: any;
type JsPDFDocument = any; // Alias for the jsPDF instance type for clarity

const addHeader = (doc: JsPDFDocument, title: string) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FTTH Guardian AI', 14, 22);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 14, 30);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
};

const addFooter = (doc: JsPDFDocument) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
        doc.text(`Relatório gerado em: ${new Date().toLocaleString()}`, 14, doc.internal.pageSize.height - 10);
    }
};

export const generateOperationalReport = async (predictions: Prediction[]) => {
    const doc: JsPDFDocument = new jspdf.jsPDF();
    
    addHeader(doc, 'Relatório Operacional');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo de Previsões Ativas', 14, 45);
    
    const predictionData = predictions.map(p => [
        p.entity,
        `${p.riskPercentage}%`,
        p.timeframe,
        p.details
    ]);
    
    (doc as any).autoTable({
        startY: 50,
        head: [['Entidade (ONU/Cliente)', 'Risco de Falha', 'Janela (Previsão)', 'Causa Provável']],
        body: predictionData,
        theme: 'striped',
        headStyles: { fillColor: [29, 78, 216] } // primary-700
    });
    
    addFooter(doc);
    
    doc.save(`FTTH_Guardian_Operacional_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateMLReport = async (
    metrics: ModelMetrics, 
    importance: FeatureImportance[],
    driftChartImage: string,
    importanceChartImage: string
) => {
    const doc: JsPDFDocument = new jspdf.jsPDF();
    
    addHeader(doc, 'Relatório de Machine Learning');

    // Metrics
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Métricas do Modelo Ativo', 14, 45);
    
    const metricsData = [
        ['Versão do Modelo', metrics.version],
        ['Algoritmo', metrics.algorithm],
        ['Data de Treinamento', new Date(metrics.trainingDate).toLocaleDateString()],
        ['Acurácia', `${(metrics.accuracy * 100).toFixed(2)}%`],
        ['F1-Score', metrics.f1Score.toFixed(2)],
        ['ROC AUC', metrics.rocAuc.toFixed(2)],
    ];
    
    (doc as any).autoTable({
        startY: 50,
        body: metricsData,
        theme: 'grid',
        styles: { cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } },
    });
    
    let lastY = (doc as any).lastAutoTable.finalY + 15;
    
    // Charts
    doc.text('Gráficos de Performance', 14, lastY);
    
    const imgProps = doc.getImageProperties(importanceChartImage);
    const imgWidth = 180;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    doc.addImage(importanceChartImage, 'PNG', 14, lastY + 5, imgWidth, imgHeight);

    lastY += imgHeight + 15;

    const driftImgProps = doc.getImageProperties(driftChartImage);
    const driftImgHeight = (driftImgProps.height * imgWidth) / driftImgProps.width;
    doc.addImage(driftChartImage, 'PNG', 14, lastY, imgWidth, driftImgHeight);

    // New page for feature importance table
    doc.addPage();
    addHeader(doc, 'Relatório de Machine Learning');
    doc.text('Importância das Features', 14, 45);
    
    const importanceData = importance.map(f => [
        f.feature,
        f.importance.toFixed(4)
    ]);
    
     (doc as any).autoTable({
        startY: 50,
        head: [['Feature', 'Importância']],
        body: importanceData,
        theme: 'striped',
        headStyles: { fillColor: [29, 78, 216] }
    });

    addFooter(doc);
    
    doc.save(`FTTH_Guardian_ML_${new Date().toISOString().split('T')[0]}.pdf`);
};