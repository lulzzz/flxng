import { Component, OnInit } from '@angular/core';

import { ChoiceWithIndices } from '@flxng/mentions';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-overview-a',
  templateUrl: './overview-a.component.html',
  styleUrls: ['./overview-a.component.scss'],
})
export class OverviewAComponent implements OnInit {
  text = ``;
  loading = false;
  choices: User[] = [];
  mentions: ChoiceWithIndices[] = [];

  constructor() {}

  ngOnInit() {}

  async loadChoices(searchTerm: string): Promise<User[]> {
    const users = await this.getUsers();

    this.choices = users.filter((user) => {
      const alreadyExists = this.mentions.some((m) => m.choice.name === user.name);
      return !alreadyExists && user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

    return this.choices;
  }

  getChoiceLabel = (user: User): string => {
    return `@${user.name}`;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
    console.log('mentions:', this.mentions);
  }

  onMenuShow(): void {
    console.log('Menu show!');
  }

  onMenuHide(): void {
    console.log('Menu hide!');
    this.choices = [];
  }

  async getUsers(): Promise<User[]> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loading = false;
        resolve([
          {
            id: 1,
            name: 'Amelia',
          },
          {
            id: 2,
            name: 'John',
          },
          {
            id: 3,
            name: 'John Doe',
          },
          {
            id: 4,
            name: 'John J. Doe',
          },
          {
            id: 5,
            name: 'John & Doe',
          },
          {
            id: 6,
            name: 'Donald',
          },
          {
            id: 7,
            name: 'Brian',
          },
          {
            id: 8,
            name: 'Ted',
          },
          {
            id: 9,
            name: 'Joe Ted',
          },
          {
            id: 10,
            name: 'Clara',
          },
          {
            id: 11,
            name: 'Lisa',
          },
          {
            id: 12,
            name: 'Mia',
          },
          {
            id: 12,
            name: 'Fred',
          },
        ]);
      }, 600);
    });
  }
}
