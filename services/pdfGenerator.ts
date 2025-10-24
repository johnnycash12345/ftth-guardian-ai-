import type { ModelMetrics, Prediction, FeatureImportance } from '../types';

// Let TypeScript know about the global variables from the script tags
declare const jspdf: any;

const doc = new jspdf.jsPDF();

const addHeader = (title: string) => {
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FTTH Guardian AI', 14, 22);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(title, 14, 30);
    doc.setLineWidth(0.5);
    doc.line(14, 35, 196, 35);
};

const addFooter = () => {
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
    // Reset document
    const newDoc = new jspdf.jsPDF();
    (window as any).doc = newDoc; // Make it accessible to autoTable
    
    addHeader('Relatório Operacional');
    
    newDoc.setFontSize(12);
    newDoc.setFont('helvetica', 'bold');
    newDoc.text('Resumo de Previsões Ativas', 14, 45);
    
    const predictionData = predictions.map(p => [
        p.entity,
        `${p.riskPercentage}%`,
        p.timeframe,
        p.details
    ]);
    
    (newDoc as any).autoTable({
        startY: 50,
        head: [['Entidade (ONU/Cliente)', 'Risco de Falha', 'Janela (Previsão)', 'Causa Provável']],
        body: predictionData,
        theme: 'striped',
        headStyles: { fillColor: [29, 78, 216] } // primary-700
    });
    
    addFooter.call({doc: newDoc}); // Does not work
    const pageCount = newDoc.internal.getNumberOfPages();
    newDoc.setFontSize(8);
    newDoc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
        newDoc.setPage(i);
        newDoc.text(`Página ${i} de ${pageCount}`, newDoc.internal.pageSize.width - 25, newDoc.internal.pageSize.height - 10);
        newDoc.text(`Relatório gerado em: ${new Date().toLocaleString()}`, 14, newDoc.internal.pageSize.height - 10);
    }
    
    newDoc.save(`FTTH_Guardian_Operacional_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateMLReport = async (
    metrics: ModelMetrics, 
    importance: FeatureImportance[],
    driftChartImage: string,
    importanceChartImage: string
) => {
    const newDoc = new jspdf.jsPDF();
    
    addHeader.call({doc: newDoc}); // Does not work
    newDoc.setFontSize(18);
    newDoc.setFont('helvetica', 'bold');
    newDoc.text('FTTH Guardian AI', 14, 22);
    newDoc.setFontSize(14);
    newDoc.setFont('helvetica', 'normal');
    newDoc.text('Relatório de Machine Learning', 14, 30);
    newDoc.setLineWidth(0.5);
    newDoc.line(14, 35, 196, 35);

    // Metrics
    newDoc.setFontSize(12);
    newDoc.setFont('helvetica', 'bold');
    newDoc.text('Métricas do Modelo Ativo', 14, 45);
    
    const metricsData = [
        ['Versão do Modelo', metrics.version],
        ['Algoritmo', metrics.algorithm],
        ['Data de Treinamento', new Date(metrics.trainingDate).toLocaleDateString()],
        ['Acurácia', `${(metrics.accuracy * 100).toFixed(2)}%`],
        ['F1-Score', metrics.f1Score.toFixed(2)],
        ['ROC AUC', metrics.rocAuc.toFixed(2)],
    ];
    
    (newDoc as any).autoTable({
        startY: 50,
        body: metricsData,
        theme: 'grid',
        styles: { cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } },
    });
    
    let lastY = (newDoc as any).lastAutoTable.finalY + 15;
    
    // Charts
    newDoc.text('Gráficos de Performance', 14, lastY);
    
    const imgProps = newDoc.getImageProperties(importanceChartImage);
    const imgWidth = 180;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    newDoc.addImage(importanceChartImage, 'PNG', 14, lastY + 5, imgWidth, imgHeight);

    lastY += imgHeight + 15;

    const driftImgProps = newDoc.getImageProperties(driftChartImage);
    const driftImgHeight = (driftImgProps.height * imgWidth) / driftImgProps.width;
    newDoc.addImage(driftChartImage, 'PNG', 14, lastY, imgWidth, driftImgHeight);

    // New page for feature importance table
    newDoc.addPage();
    newDoc.setFontSize(18);
    newDoc.setFont('helvetica', 'bold');
    newDoc.text('FTTH Guardian AI', 14, 22);
    newDoc.setFontSize(14);
    newDoc.setFont('helvetica', 'normal');
    newDoc.text('Relatório de Machine Learning', 14, 30);
    newDoc.setLineWidth(0.5);
    newDoc.line(14, 35, 196, 35);
    newDoc.text('Importância das Features', 14, 45);
    
    const importanceData = importance.map(f => [
        f.feature,
        f.importance.toFixed(4)
    ]);
    
     (newDoc as any).autoTable({
        startY: 50,
        head: [['Feature', 'Importância']],
        body: importanceData,
        theme: 'striped',
        headStyles: { fillColor: [29, 78, 216] }
    });

    const pageCount = newDoc.internal.getNumberOfPages();
    newDoc.setFontSize(8);
    newDoc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
        newDoc.setPage(i);
        newDoc.text(`Página ${i} de ${pageCount}`, newDoc.internal.pageSize.width - 25, newDoc.internal.pageSize.height - 10);
        newDoc.text(`Relatório gerado em: ${new Date().toLocaleString()}`, 14, newDoc.internal.pageSize.height - 10);
    }
    
    newDoc.save(`FTTH_Guardian_ML_${new Date().toISOString().split('T')[0]}.pdf`);
};