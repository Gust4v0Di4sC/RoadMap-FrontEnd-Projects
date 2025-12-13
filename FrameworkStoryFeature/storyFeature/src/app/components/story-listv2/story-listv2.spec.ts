import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryListv2 } from './story-listv2';

describe('StoryListv2', () => {
  let component: StoryListv2;
  let fixture: ComponentFixture<StoryListv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryListv2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryListv2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
