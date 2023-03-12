const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const morgan = require('morgan');

// express app
const app = express();

//connect to mongodb
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6cfoi3l.mongodb.net/node?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('connected to db');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((err) => {
    console.log(err);
  });

//register view
app.set('view engine', 'ejs');

//middleware
app.use(express.urlencoded({ extended: true }));

//routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//blog routes
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create' });
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);

  blog.save()
    .then((result)=>{
      res.redirect('/blogs');
    })
    .catch((err)=>{
      console.log(err);
    });
});

app.get('/blogs/:id',(req, res)=>{
  const id=req.params.id;
  Blog.findById(id)
    .then(result=>{
      res.render('details',{blog:result,title:'Blog Details'})
    })
    .catch(err=>{
      console.log(err);
    })
})

app.delete('/blogs/:id',(req, res)=>{
  const id=req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result=>{
      res.json({redirect:'/blogs'})
    })
    .catch(err=>{
      console.log(err);
    })
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

