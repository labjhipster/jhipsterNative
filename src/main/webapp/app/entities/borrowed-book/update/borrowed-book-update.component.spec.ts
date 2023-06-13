import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BorrowedBookService } from '../service/borrowed-book.service';
import { IBorrowedBook, BorrowedBook } from '../borrowed-book.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';

import { BorrowedBookUpdateComponent } from './borrowed-book-update.component';

describe('BorrowedBook Management Update Component', () => {
  let comp: BorrowedBookUpdateComponent;
  let fixture: ComponentFixture<BorrowedBookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let borrowedBookService: BorrowedBookService;
  let bookService: BookService;
  let clientService: ClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BorrowedBookUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BorrowedBookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BorrowedBookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    borrowedBookService = TestBed.inject(BorrowedBookService);
    bookService = TestBed.inject(BookService);
    clientService = TestBed.inject(ClientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call book query and add missing value', () => {
      const borrowedBook: IBorrowedBook = { id: 456 };
      const book: IBook = { id: 84515 };
      borrowedBook.book = book;

      const bookCollection: IBook[] = [{ id: 52291 }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const expectedCollection: IBook[] = [book, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      expect(bookService.query).toHaveBeenCalled();
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(bookCollection, book);
      expect(comp.booksCollection).toEqual(expectedCollection);
    });

    it('Should call client query and add missing value', () => {
      const borrowedBook: IBorrowedBook = { id: 456 };
      const client: IClient = { id: 37780 };
      borrowedBook.client = client;

      const clientCollection: IClient[] = [{ id: 86092 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const expectedCollection: IClient[] = [client, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(clientCollection, client);
      expect(comp.clientsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const borrowedBook: IBorrowedBook = { id: 456 };
      const book: IBook = { id: 9513 };
      borrowedBook.book = book;
      const client: IClient = { id: 72234 };
      borrowedBook.client = client;

      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(borrowedBook));
      expect(comp.booksCollection).toContain(book);
      expect(comp.clientsCollection).toContain(client);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BorrowedBook>>();
      const borrowedBook = { id: 123 };
      jest.spyOn(borrowedBookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: borrowedBook }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(borrowedBookService.update).toHaveBeenCalledWith(borrowedBook);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BorrowedBook>>();
      const borrowedBook = new BorrowedBook();
      jest.spyOn(borrowedBookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: borrowedBook }));
      saveSubject.complete();

      // THEN
      expect(borrowedBookService.create).toHaveBeenCalledWith(borrowedBook);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BorrowedBook>>();
      const borrowedBook = { id: 123 };
      jest.spyOn(borrowedBookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrowedBook });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(borrowedBookService.update).toHaveBeenCalledWith(borrowedBook);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBookById', () => {
      it('Should return tracked Book primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBookById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackClientById', () => {
      it('Should return tracked Client primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackClientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
