import { TestBed } from '@angular/core/testing';

import { ActiveVotesService } from './active-votes.service';

describe('ActiveVotesService', () => {
  let service: ActiveVotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveVotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
