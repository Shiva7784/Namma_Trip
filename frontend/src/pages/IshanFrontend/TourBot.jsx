const TourBot = () => (
    <>
        <link rel="stylesheet" href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css" />
        <df-messenger
  intent="WELCOME"
  chat-title="Tour_Bot"
  agent-id="d6b1526d-bd10-4fd2-8f87-3b7461384d70"
  language-code="en"
></df-messenger>
        <style>{`
            df-messenger {
                z-index: 999;
                position: fixed;
                --df-messenger-font-color: #000;
                --df-messenger-font-family: Google Sans;
                --df-messenger-chat-background: #f3f6fc;
                --df-messenger-message-user-background: #d3e3fd;
                --df-messenger-message-bot-background: #fff;
                bottom: 16px;
                right: 16px;
                --df-messenger-chat-bubble-background: #a8c7fa;
            }
        `}</style>
    </>
);
export default TourBot;