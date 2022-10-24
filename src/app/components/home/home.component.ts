import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Note } from 'src/app/models/note.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  notesForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required])
  });

  constructor(private auth: Auth, public databaseService: DatabaseService, public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onAddNote() {
    const title = this.notesForm.value.title!!
    const content = this.notesForm.value.content!!
    const date = this.notesForm.value.date!!

    const note: Note = {
      nid: '',
      userId: this.auth.currentUser!!.uid,
      title,
      content,
      date
    }
    this.databaseService.saveNote(note);
  }
}
