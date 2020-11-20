import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  SecurityContext
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/services/email.service';
import {
  IEmailForm,
  EmailFields,
  DEFAULT_EMAIL_FORM,
  IEmailBEData,
  ALERTS,
  EMAIL_FIELDS_TEXT
} from '../../../app.definitions';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailComponent {
  inProgress = false; // Avoid double clicks & unnecessary API calls
  emailForm: IEmailForm = DEFAULT_EMAIL_FORM;
  tplText = EMAIL_FIELDS_TEXT;
  readonly fieldNames = EmailFields;

  constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private emailService: EmailService,
    private snackBar: MatSnackBar,
  ) {}

  send(): void {
    if (this.inProgress) { return; }
    const data = this.getData();
    if (!this.isValidReq(data)) {
      this.openSnackbar(ALERTS.INVALID_REQUEST);
      return;
    }
    this.inProgress = true;
    this.emailService.sendEmail(data).subscribe(() => {
      this.openSnackbar(ALERTS.SUCCESS);
      this.enableSendBtn();
      this.emailForm = DEFAULT_EMAIL_FORM;
    }, (err) => {
      // TODO: Use Error logging/tracing mechanism on production
      console.log('API Error: ', err);
      this.openSnackbar(ALERTS.API_ERROR);
      this.enableSendBtn();
    });
  }

  sanitizeInput(text: string, key: EmailFields): void {
    // TODO: Debounce this to avoid unncessary calls on each user keystroke
    // Remove any potentially malicious/dangerous inputs
    this.emailForm[key] = this.sanitizer.sanitize(SecurityContext.HTML, text);
  }

  private enableSendBtn(): void {
    this.inProgress = false;
    this.cdRef.detectChanges();
  }

  private openSnackbar(text: string = '', action: string = '', duration: number = 4000): void {
    this.snackBar.open(text, action, { duration });
  }

  private isValidReq(data: IEmailBEData): boolean {
    if (!data.to || !data.to_name || !data.from ||
      !data.from_name || !data.subject || !data.body
    ) { return false; }
    return true;
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
