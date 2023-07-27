var express = require('express');
var router = express.Router();

var Datastore = require('nedb') //nedb Class 로드
  , db = new Datastore(); //db 변수에 Datasotre 클래스 생성

db.posts = new Datastore('posts.db'); //posts.db에 db.posts 테이블 데이터 링크
db.comments = new Datastore('comments.db'); //comments.db에 comments.posts 테이블 데이터 링크
db.login = new Datastore('login.db'); //login.db에 db.login 테이블 데이터 링크

//데이터 베이스 로드
db.posts.loadDatabase();
db.comments.loadDatabase();
db.login.loadDatabase();

let date = new Date()
let shortDate = date.toLocaleDateString()

/* GET home page. */
router.get('/api/main', (req, res) => {
  res.send({ response: "사나이 황's 게시판입니다. 계속하시려면 로그인 해주시기바랍니다." });
});

// Get login page
router.post('/api/get/CreateAccount', (req, res) => {

  console.log("req", req.body)
  db.login.insert({
    host: "localhost",
    user_id: req.body.user_id,
    user_pw: req.body.user_pw,
    Author: req.body.Author,
    user_checkpw: req.body.user_checkpw,
    creationDate: shortDate
  }, (err2, newLogin) => {
    if (err2) {
      console.error(err2)
    } else {
      console.log("로그인 되었습니다..")
    }
    console.log(newLogin);
    res.send(newLogin);
  })
});

/* GET home page. */
router.post('/api/get/onLogin', (req, res) => {


  console.log("123", req)

  db.login.find({ $and: [{ user_id: req.body.user_id }, { user_pw: req.body.user_pw }] }, function (err, docs) {

    console.log("이거봐1", docs)
    if (docs.length != 0) {
      res.send(docs);
    }
  });
});

/* get All Posts */
router.post('/api/get/allPosts', (req, res) => {
  db.posts.find({ useYn: "yes" }, function (err, docs) {
    res.send(docs);
  });
});

/* get clear Posts */
router.get('/api/clearPosts', (req, res) => {
  db.posts.remove({}, { multi: true }, function (err, numRemoved) {
    res.send(numRemoved + " Item Removed!");
  });
});

/* get All Comments */
router.post('/api/get/allComments', (req, res) => {
  db.comments.find({}, function (err, docs) {
    res.send(docs);
  });
});

/* posts Clear */
router.post('/api/reset/contents', (req, res) => {
  db.posts.remove({}, { multi: true }, function (err, numRemoved) {
    res.send({ msg: numRemoved + " Items Removed" });
  });
});

/* comments Clear */
router.post('/api/reset/comments', (req, res) => {
  db.comments.remove({}, { multi: true }, function (err, numRemoved) {
    res.send({ msg: numRemoved + " Items Removed" });
  });
});

/* account Clear */
router.post('/api/reset/account', (req, res) => {
  db.login.remove({}, { multi: true }, function (err, numRemoved) {
    res.send({ msg: numRemoved + " Items Removed" });
  });
});

/* create Post */
router.post('/api/new/post', (req, res) => {

  console.log("shortdate", shortDate);
  db.posts.count({}, (err, count) => {

    db.posts.insert({
      id: count + 1,
      title: req.body.title,
      contents: req.body.contents,
      author: req.body.author,
      password: req.body.password,
      creationDate: shortDate,
      view: 0,
      useYn: "yes"
    }, (err2, newPost) => {
      if (err2) {
        console.error(err2)
      } else {
        console.log("새로운 게시글이 작성되었습니다.")
      }
      console.log(newPost);
      res.send(newPost);
    })
  })
})

/* create Comments */
router.post('/api/new/comment', (req, res) => {

  db.comments.count({}, (err, count) => {
    db.comments.insert({
      id: req.body.id,
      id2: count + 1,
      author: req.body.author,
      comments: req.body.comments,
      creationDate: shortDate,
      useYn: "yes"
    }, (err2, newComment) => {
      console.log(newComment);
      res.send(newComment);
    })
  })
})

router.post('/api/new/recomment', (req, res) => {
  db.comments.count({}, (err, count) => {
    db.comments.insert({
      id: req.body.id,
      id2: req.body.id2,
      id3: count + 1,
      parent_id: req.body.parent_id, // 댓글의 id를 저장하여 부모 댓글을 구분
      author: req.body.author,
      recomments: req.body.recomments,
      creationDate: shortDate,
      useYn: "yes"
    }, (err, newRecomment) => {

      console.log(newRecomment);
      res.send(newRecomment);

    });
  })
});

/* get Post */
router.post('/api/get/post', (req, res) => {
  console.log(req.body.id)
  db.posts.find({ id: req.body.id }, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
})

/* get Comment */
router.post('/api/get/comment', (req, res) => {
  console.log("req", req.body)
  db.comments.find({
    id: req.body.id,
    useYn: "yes"
  }, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
})

//delete content

router.post('/api/delete/content', (req, res) => {
  db.posts.update({ id: req.body.id }, { $set: { useYn: 'no' } }, function (err, numReplaced) {
    res.send({ msg: "됐따" });

    // numReplaced = 3
    // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
  });
})

//update content
router.post('/api/update/post', (req, res) => {
  console.log("게시글 업데이트:", req.body);

  const { id, title, contents, creationDate } = req.body;
  db.posts.update({ id }, { $set: { title, contents, creationDate } }, (err, numReplaced) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "게시글 업데이트에 실패했습니다." });
    } else {
      res.send({ msg: "게시글이 성공적으로 업데이트되었습니다." });
    }
  });
});

//update comment
router.post('/api/update/comment', (req, res) => {
  console.log("게시글 업데이트:", req.body);

  const { id2, comments, creationDate } = req.body;
  db.comments.update({ id2 }, { $set: { comments, creationDate } }, (err, numReplaced) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: "댓글 업데이트에 실패했습니다." });
    } else {
      res.send({ msg: "댓글이 성공적으로 업데이트되었습니다." });
    }
  });
});



//delete comment

router.post('/api/delete/comment', (req, res) => {
  console.log("qqqqqqqqqq", req.body)
  db.comments.update({ id2: req.body.id2 }, { $set: { useYn: 'no' } }, function (err, numReplaced) {
    // console.log("res", res) 
    res.send({ msg: "됐따" });
    // numReplaced = 3
    // Field 'system' on Mars, Earth, Jupiter now has value 'solar system'
  });
})



// 클라이언트로부터 POST 요청이 들어오면 처리하는 핸들러
router.post('/api/view/post', (req, res) => {
  // 클라이언트로부터 전달받은 게시글의 ID와 현재 조회수를 가져옵니다.
  console.log("여기다", req.body)

  db.posts.update({ id: req.body.id }, { $set: { view: req.body.view + 1 } },
    {}, // 옵션
    function (err, numReplaced) {
      res.send({ numReplaced })
      // if (err) {
      //   console.error(err);
      //   res.status(500).send('조회수 업데이트 중 오류가 발생했습니다.');
      // } else {
      //   console.log('조회수 업데이트 완료');
      //   res.send({ view: updatedView });
      // }
    }
  );

});


module.exports = router;
