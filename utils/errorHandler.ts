import { AppError } from '../types';

/**
 * Centralized error handler.
 * Logs the full technical details of an error for debugging purposes
 * and returns a user-friendly message to be displayed in the UI.
 * @param error - The error object caught.
 * @returns A safe, user-friendly error message string.
 */
export const handleError = (error: unknown): string => {
  if (error instanceof AppError) {
    console.error("Application Error:", {
      userMessage: error.userMessage,
      technicalDetails: error.technicalDetails,
      stack: error.stack,
    });
    return error.userMessage;
  }
  
  if (error instanceof Error) {
    console.error("Unexpected Error:", error);
    return "Ocorreu um erro inesperado. Por favor, tente novamente.";
  }
  
  console.error("Unknown Error:", error);
  return "Ocorreu um erro desconhecido.";
};
