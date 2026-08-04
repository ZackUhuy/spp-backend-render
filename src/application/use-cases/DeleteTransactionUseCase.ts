import type { ITransactionRepository } from "../../domain/repositories/ITransactionRepository.js";
import { NotFoundError } from "../../domain/errors/AppError.js";

export class DeleteTransactionUseCase {
  constructor(private transactionRepository: ITransactionRepository) {}

  async execute(id: number): Promise<void> {
    const existingTransaction = await this.transactionRepository.findById(id);
    if (!existingTransaction) {
      throw new NotFoundError("Transaksi tidak ditemukan");
    }

    await this.transactionRepository.delete(id);
  }
}
