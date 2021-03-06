import React, { useEffect } from 'react';
import axios from 'axios';
import './App.css'
import { useMedia } from 'react-media';



const App = () => {

  const GLOBAL_MEDIA_QUERIES = {
    small: "(max-width: 599px)",
    medium: "(min-width: 600px) and (max-width: 1199px)",
    large: "(min-width: 1200px)"
  };
  const matches = useMedia({ queries: GLOBAL_MEDIA_QUERIES });

  const type = matches.large ? 'pc' : 'pe';
  const rederBodySide = () => {
    return (
      <div className="bodySide">
        <div className="box1">
          <p>公告</p>
          <div className="list1 link">
            <p>2021助贷政策</p>
            <p>2021助贷政策</p>
            <p>2021助贷政策</p>
            <p>2021助贷政策</p>
            <p>2021助贷政策</p>
          </div>
        </div>
        <div className="box2">
          <p>常见问题</p>
          <div className="list2 link">
            <p>你好吗?</p>
            <p>吃了吗?</p>
            <p>睡了吗?</p>
          </div>
        </div>
      </div>
    )
  }
  // const url =
  //   "https://www.fastmock.site/mock/9371d6330f8fc2f273cbfedf9beecd0a/chatbot/api/answer#!method=POST&queryParameters=%5B%5D&body=%7B%22uid%22%3A%22sdhasxuasabjxbzcdufscjz%22%2C+%22question%22%3A+%22%E6%88%91%E6%98%AF%E8%B0%81%EF%BC%9F%22%7D&headers=%5B%5D";
  useEffect(() => {
    const chatbotWrap = document.querySelector(".chatbotWrap");
    const welcomeBox = document.querySelector(".welcomeBox");
    chatbotWrap.addEventListener("click", openChatbot);
    welcomeBox.addEventListener("click", openChatbot);

    // 展开
    function openChatbot() {
      window.parent.postMessage('open', "*");
      chatbotWrap.classList.remove("chatFold");
      welcomeBox.classList.add("hide")
    }

    document
      .querySelector(".closeChatBot")
      .addEventListener("click", onCloseChatbot);

    //关闭
    function onCloseChatbot() {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      chatbotWrap.classList.add("chatFold");
      window.parent.postMessage('close', "*");
      welcomeBox.classList.remove('hide')
    }

    //点击发送按钮或按下回车
    const sendBtn = document.querySelector(".chatbotFoot .send");
    const input = document.querySelector(".chatbotFoot .userInput");
    const chatbotBody = document.querySelector(".chatbotBody");
    let msg = ''
    input.onkeyup = () => {
      msg = input.value;
      console.log(msg)
    }
    sendBtn.addEventListener("click", () => { sendMsg(msg); msg = '' });
    input.addEventListener("keyup", (e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        sendMsg(msg);
        msg = ''
      }
    });

    // 点击初始关键词
    const k1 = document.querySelector('#k1')
    const k2 = document.querySelector('#k2')
    const k3 = document.querySelector('#k3')
    const k4 = document.querySelector('#k4')
    // k1.onclick=()=>{sendMsg(k1.innerHTML);console.log(1)}
    k1.addEventListener('click', () => { sendMsg(k1.innerHTML) })
    k2.onclick = () => { sendMsg(k2.innerHTML) }
    k3.onclick = () => { sendMsg(k3.innerHTML) }
    k4.onclick = () => { sendMsg(k4.innerHTML) }


    // 聊天气泡
    class Bubble {
      msg = ''
      class = ''
      constructor(m = '', c = userAsk) {
        this.msg = m
        this.class = c
        this.add()
      }
      add() {
        const bubble = document.createElement('div')
        bubble.classList.add(this.class)
        bubble.innerHTML = this.msg
        chatbotBody.appendChild(bubble)
      }
    }


    function sendMsg(msg) {
      if (msg.trim() === "") {
        return false;
      }
      new Bubble(msg, 'userAsk')
      //用innerHtml加元素会导致页面重载，之前绑定的事件会丢失，要重新获取并绑定
      // chatbotBody.innerHTML += '<div class="userAsk">' + msg + '</div>';
      chatbotBody.scrollTop = chatbotBody.scrollHeight;


      axios
        .get('https://ncuqa-api.ncuos.com/search/zzzx?q=' + msg)
        .then((result) => {
          const answer = result.data.data[0].answer;
          const question = result.data.data[0].question;
          const allData = result.data.data
          if (answer.trim() === '') {
            new Bubble(
              '这个问题智能小助手还无法回答哦，可以在' +
              '<a target="_blank" href="https://docs.qq.com/form/page/DQXZVUXZJcFdPalVI?_w_tencentdocx_form=1">这里(【腾讯文档】资助机器人问答反馈)<a/>' +
              '反馈你的问题,稍后会有工作人员解答,也可以加入我们的资助系统答疑.' +
              '<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=pvxuiMdtRaCsE4ZDNN5t15NhTQzmOqVo&jump_from=webapi">892402887' +
              '<img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="资助答疑群-chatbot" title="资助答疑群-chatbot"></a>',
              'botResponse'
            )
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
            return false;
          }

          if (msg === question) {
            new Bubble(
              '<div class="botResponse">' +
              answer +
              '<br/><a class="askOther" style="color: cornflowerblue;text-decoration: underline;cursor: pointer;">我想问其他</a>',
              'botResponse'
            )

            chatbotBody.scrollTop = chatbotBody.scrollHeight;
          } else {
            new Bubble(
              '你是否想问：\"' + question + '\"?<br/>' + answer +
              '<br/><a class="askOther" style="color: cornflowerblue;text-decoration: underline;cursor: pointer;">我想问其他</a>',
              'botResponse'
            )

            chatbotBody.scrollTop = chatbotBody.scrollHeight;

          }

          const askOther = document.getElementsByClassName('askOther')
          askOther[askOther.length - 1].onclick = () => {
            askOtherFn(allData)
            askOther[askOther.length - 1].style.color = 'gray'
          }
        })
        .catch((err) => {
          console.err(err);
        });

      input.value = "";
    }

    function askOtherFn(allData) {
      const otherQuestions = allData.map(q => {
        return (`<p class='other${q.rank} link '>${q.rank}.${q.question}</p>`)
      })
      new Bubble(
        `你是否想问:<div>${otherQuestions.join('')}</div>
        <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=pvxuiMdtRaCsE4ZDNN5t15NhTQzmOqVo&jump_from=webapi" class='link'>
        以上都没有？点我进入人工客服
        </a>
        `,
        'botResponse'
      )
      chatbotBody.scrollTop = chatbotBody.scrollHeight;

      const other1 = document.getElementsByClassName('other1')
      const other2 = document.getElementsByClassName('other2')
      const other3 = document.getElementsByClassName('other3')
      const other4 = document.getElementsByClassName('other4')
      other1[other1.length - 1].onclick = () => { sendMsg(allData[0].question); other1[other1.length - 1].style.color = 'gray' }
      other2[other2.length - 1].onclick = () => { sendMsg(allData[1].question); other2[other2.length - 1].style.color = 'gray' }
      other3[other3.length - 1].onclick = () => { sendMsg(allData[2].question); other3[other3.length - 1].style.color = 'gray' }
      other4[other4.length - 1].onclick = () => { sendMsg(allData[3].question); other4[other4.length - 1].style.color = 'gray' }
      // if (allData[1].answer.trim() != '') {


      // }
      // if (allData[2].answer.trim() != '') {
      //   new Bubble(
      //     '你是否想问：\"' + allData[2].question + '\"?<br/>' + allData[2].answer +
      //     'botResponse'
      //   )

      //   // chatbotBody.innerHTML +=
      //   //   '<div class="botResponse">' +
      //   //   '你是否想问：\"' + allData[2].question + '\"?<br/>' + allData[2].answer +
      //   //   '</div>';
      //   chatbotBody.scrollTop = chatbotBody.scrollHeight;
      // }

      // new Bubble(
      //   '这个问题智能小助手还无法回答哦，可以在' +
      //   '<a target="_blank" href="https://docs.qq.com/form/page/DQXZVUXZJcFdPalVI?_w_tencentdocx_form=1">这里(【腾讯文档】资助机器人问答反馈)<a/>' +
      //   '反馈你的问题,稍后会有工作人员解答,也可以加入我们的资助系统答疑.' +
      //   '<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=pvxuiMdtRaCsE4ZDNN5t15NhTQzmOqVo&jump_from=webapi">892402887' +
      //   '<img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="资助答疑群-chatbot" title="资助答疑群-chatbot"></a>',
      //   'botResponse'
      // )

      // chatbotBody.innerHTML += 
      //   '<div class="botResponse">' +
      //   '这个问题智能小助手还无法回答哦，可以在'+
      //   '<a target="_blank" href="https://docs.qq.com/form/page/DQXZVUXZJcFdPalVI?_w_tencentdocx_form=1">这里(【腾讯文档】资助机器人问答反馈)<a/>'+
      //   '反馈你的问题,稍后会有工作人员解答,也可以加入我们的资助系统答疑.'+
      //   '<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=pvxuiMdtRaCsE4ZDNN5t15NhTQzmOqVo&jump_from=webapi">892402887' +
      //   '<img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="资助答疑群-chatbot" title="资助答疑群-chatbot"></a>' +
      //   '</div>';
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    // 测试
    // axios.get('https://service-79wvnzqk-1256880247.gz.apigw.tencentcs.com/release/yuyan_version?ask=助贷中心值班时间')
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }, []);

  return (
    <div>
      <div className="container">

        <div className="welcomeBox">
          <img src="./u3.png" alt="" />
        </div>

        <div className="chatbotWrap chatFold">


          <div className="chatbotHead">
            <h2>AI机器人———助宝</h2>
            <button className="closeChatBot">X</button>
          </div>

          <div className="chatbotBody">
            <div className="botResponse">您好，我是南昌大学学生资助中心的AI答疑机器人。我的名字叫：助宝，专门解答学生资助政策相关问题。</div>
            <div className="botResponse">请问您有什么问题想要了解的？您可以输入关键字问我噢！常用关键字：
              <span id="k1">新生入学</span>、
              <span id="k2">家庭经济困难</span>、
              <span id="k3">助学贷款</span>、
              <span id="k4">学费减免</span>。
            </div>
            {/* <!-- <div className="userAsk">你好请问……</div> --> */}
            {/* <!-- <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=pvxuiMdtRaCsE4ZDNN5t15NhTQzmOqVo&jump_from=webapi"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="资助答疑群-chatbot" title="资助答疑群-chatbot"></a> --> */}
          </div>

          {type == 'pc' && rederBodySide()}
          <div className="chatbotFoot">
            <input type="text" className="userInput" placeholder=" 请输入" />
            <button className="send">发送</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
