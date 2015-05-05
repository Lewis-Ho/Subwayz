class Feedback < ApplicationMailer
  default from: "no-reply@subwayz.herokuapp.com"

  def send_feedback(user, text)
    @reply_email = user
    @mail_body = text
    mail(to: 'subwayz.info+feedback@gmail.com', subject:'Feedback')
  end

end