import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryViewerv2 } from './story-viewerv2';

describe('StoryViewerv2', () => {
  let component: StoryViewerv2;
  let fixture: ComponentFixture<StoryViewerv2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryViewerv2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryViewerv2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
