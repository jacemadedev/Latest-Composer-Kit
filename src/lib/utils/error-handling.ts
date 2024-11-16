export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }

  static fromError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error
    }

    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN_ERROR', 500, error)
    }

    return new AppError('An unknown error occurred', 'UNKNOWN_ERROR', 500, error)
  }
}

export function handleError(error: unknown): AppError {
  console.error('Error:', error)
  return AppError.fromError(error)
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage = 'Operation failed'
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    throw handleError(error)
  }
}