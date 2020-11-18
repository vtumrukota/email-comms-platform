import { ChangeDetectionStrategy, Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { IEmailForm, EmailFields, DEFAULT_EMAIL_FORM, IEmailBEData } from '../../../app.definitions';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailComponent implements OnInit {
  emailForm: IEmailForm = DEFAULT_EMAIL_FORM;
  fieldNames = EmailFields;

  constructor(private sanitizer: DomSanitizer, private emailService: EmailService ) { }

  ngOnInit(): void {
    console.log('fired send email');
  }

  send(): void {
    const data = this.getData();
    console.log('send email data', data);
    this.emailService.sendEmail(data).subscribe((resp) => {
      console.log('response', resp);
    }, (err) => {
      console.log('err block', err);
    });
  }

  sanitizeInput(text: string, key: EmailFields): void {
    // TODO: Debounce this to avoid unncessary calls on each user keystroke
    // Remove any potentially malicious/dangerous inputs
    console.log('text', text, key);
    this.emailForm[key] = this.sanitizer.sanitize(SecurityContext.HTML, text);
  }

  private getData(): IEmailBEData {
    return {
      to: this.emailForm.recipientEmail,
      to_name: this.emailForm.recipientName,
      from: this.emailForm.senderEmail,
      from_name: this.emailForm.senderName,
      subject: this.emailForm.subject,
      body: this.emailForm.message,
    };
  }

}
