import { TestBed } from '@angular/core/testing';

import { DiscussionService } from './discussions.service';

describe('DiscussionsService', () => {
  let service: DiscussionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
