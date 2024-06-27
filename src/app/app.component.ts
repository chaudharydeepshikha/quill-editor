import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuillEditorComponent } from "ngx-quill";

import "quill-mention/autoregister";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  form!: FormGroup;
  inputValue1: string = '';
  users = ['Alice', 'Bob', 'Charlie', 'David'];
  filteredUsers: string[] = [];
  showAutocomplete = false;
  @ViewChild('auto') auto!: any;


  inputValue?: string;
  filteredOptions: string[] = [];
  options = ['Burns Bay Road', 'Downing Street', 'Wall Street'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      inputControl: ['']
    });
    this.filteredOptions = this.options;
  }

  onInput(value: any): void {
    const mentionCharIndex = value.lastIndexOf('@');
    if (mentionCharIndex !== -1) {
      const searchString = value.substring(mentionCharIndex + 1);
      this.filteredUsers = this.users.filter(user => user.toLowerCase().includes(searchString.toLowerCase()));
      this.showAutocomplete = this.filteredUsers.length > 0;
    } else {
      this.showAutocomplete = false;
    }
  }

  onSelect(value: any): void {
    const inputValue = this.form.get('inputControl')?.value;
    const mentionCharIndex = inputValue.lastIndexOf('@');
    const newValue = inputValue.substring(0, mentionCharIndex + 1) + value + ' ';
    this.form.get('inputControl')?.setValue(newValue);
    this.showAutocomplete = false;
  }

  onChange(value: string): void {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  title = 'quill-editor-demo';
  editorText: string = '';
  userList = [
    { id: '1',value: "Alice Smith",age: '28',email: "alice.smith@example.com" },
    { id: '2',value: "Bob Johnson",age: '34',email: "bob.johnson@example.com"},
    { id: '3',value: "Charlie Davis",age: '25',email: "charlie.davis@example.com"},
    { id: '4',value: "Dana Lee",age: '30',email: "dana.lee@example.com"},
    { id: '5',value: "Eve Martinez",age: '27',email: "eve.martinez@example.com"}
  ];
  @ViewChild(QuillEditorComponent, { static: true })
  editor!: QuillEditorComponent;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],     // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']                                         // remove formatting button
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      showDenotationChar: false,
      spaceAfterInsert: true,
      onSelect: (item: any, insertItem: any) => {
        const editor = this.editor.quillEditor;
        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, "", "user");
      },
      source: (searchTerm: any, renderList: any) => {
        const values = this.userList;
        console.log(searchTerm);
        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches : any = [];
          values.forEach(entry => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      }
    }
  }

  getContent() {
    console.log(this.editorText);
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.editorText, 'text/html');

    const mentions = doc.querySelectorAll('.mention');

    const taggedUsers = Array.from(mentions).map(mention => ({
      id: mention.getAttribute('data-id'),
      value: mention.getAttribute('data-value'),
      email: ''
  }));

  console.log(taggedUsers);

  taggedUsers.map(user => {
    this.userList.map(u => {
      if(user.value == u.value) {
        user.email = u.email;
      }
    })
  })
  console.log(taggedUsers);
  }
}
