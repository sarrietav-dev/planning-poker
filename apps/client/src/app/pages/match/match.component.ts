import { Component, OnInit } from '@angular/core';
import { MatchService } from '../../services/match/match.service';
import { ActivatedRoute } from '@angular/router';
import { Match } from '@planning-poker/models';

@Component({
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
  ) {}

  isUserChosed: boolean = false;
  match?: Match = undefined;
  isInviteModalOpen = false;
  selectedCard = -1;

  ngOnInit(): void {
    this.matchService.getMatch().subscribe(match => {
      this.match = match;
    })
  }

  get name() {
    return this.match?.name;
  }

  handleUserChoose(data: { name: string; mode: string }) {
    this.isUserChosed = true;
    this.matchService.joinMatch(
      this.route.snapshot.paramMap.get('id')!,
      data.name,
      data.mode,
    );
  }

  handleInviteModalOpen() {
    this.isInviteModalOpen = true;
  }

  handleInviteModalClose() {
    this.isInviteModalOpen = false;
  }

  onSelectedCard(card: number) {
    if (this.selectedCard === -1) {
      this.selectedCard = card;
      this.matchService.selectCard(card);
    }
  }

  get isUserPlayer() {
    return true;
  }

  get isCardDeckModalOpen() {
    return this.selectedCard === -1 && this.isUserChosed && this.isUserPlayer;
  }

  get areCardsRevealed$() {
    return this.matchService.getAreCardsRevealed();
  }
}
