import dayjs from 'dayjs/esm';
import { IBook } from 'app/entities/book/book.model';
import { IClient } from 'app/entities/client/client.model';

export interface IBorrowedBook {
  id?: number;
  borrowDate?: dayjs.Dayjs | null;
  book?: IBook | null;
  client?: IClient | null;
}

export class BorrowedBook implements IBorrowedBook {
  constructor(public id?: number, public borrowDate?: dayjs.Dayjs | null, public book?: IBook | null, public client?: IClient | null) {}
}

export function getBorrowedBookIdentifier(borrowedBook: IBorrowedBook): number | undefined {
  return borrowedBook.id;
}
