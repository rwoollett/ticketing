import { Publisher, ExpirationCompleteEvent, Subjects} from '@rwtix/common';;

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
