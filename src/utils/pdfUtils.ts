import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WorkoutSession, Workout } from '../types';
import { formatDate } from './dateUtils';

export const exportWorkoutToPDF = async (session: WorkoutSession, workout: Workout) => {
  const pdf = new jsPDF();
  
  // Add title
  pdf.setFontSize(20);
  pdf.text('Relatório de Treino', 20, 20);
  
  // Add session info
  pdf.setFontSize(12);
  pdf.text(`Data: ${formatDate(session.date)}`, 20, 35);
  pdf.text(`Treino: ${workout.name}`, 20, 45);
  pdf.text(`Duração: ${session.duration} minutos`, 20, 55);
  pdf.text(`Status: ${session.completed ? 'Concluído' : 'Incompleto'}`, 20, 65);
  
  if (session.notes) {
    pdf.text(`Observações: ${session.notes}`, 20, 75);
  }
  
  // Add exercises
  pdf.setFontSize(16);
  pdf.text('Exercícios:', 20, 90);
  
  let yPosition = 105;
  pdf.setFontSize(10);
  
  session.exercises.forEach((exercise, index) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.text(`${index + 1}. ${exercise.name}`, 20, yPosition);
    pdf.text(`${exercise.sets} séries x ${exercise.reps} repetições`, 30, yPosition + 10);
    pdf.text(`Descanso: ${exercise.restTime}s`, 30, yPosition + 20);
    
    if (exercise.weight) {
      pdf.text(`Peso: ${exercise.weight}kg`, 30, yPosition + 30);
    }
    
    if (exercise.notes) {
      pdf.text(`Obs: ${exercise.notes}`, 30, yPosition + 40);
    }
    
    pdf.text(`Status: ${exercise.completed ? 'Concluído' : 'Pendente'}`, 30, yPosition + 50);
    
    yPosition += 65;
  });
  
  // Save the PDF
  pdf.save(`treino-${formatDate(session.date, 'yyyy-MM-dd')}.pdf`);
};

export const exportSessionElement = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF();
  const imgWidth = 190;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  
  let position = 10;
  
  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  
  pdf.save(filename);
};