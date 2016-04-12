var test = require('tape');
var fs = require('fs');
var path =  require('path');
var jsyaml = require('js-yaml');

var data = {
  themes: readData('_data/', 'themes.yml')
};

// build array of categories
var themes = data.themes.metadata.map(function(post) {
  return post.theme
});

var emojiSet = [];
var images = [];
var emoji = fs.readdirSync('images/emoji/');
emoji.forEach(function(i){
  if (isImage(i)) { 
    emojiSet.push(i.replace('.png',''));
    images.push(i);
  }
});

// validate image
function isImage(value) {
  var regex = /\.(?:png)$/i;
  return isUrl(value) && regex.test(value);
}

// validate url
function isUrl(value) {
  var regex = /^(https?:\/\/)?[\w,%-\/\.]+\/?$/;
  return regex.test(value);
}


function readData(dir, filename) {
  var buffer = fs.readFileSync(dir + filename),
  file = buffer.toString('utf8');
  try {
    return {
      name: filename,
      file: file,
      metadata: jsyaml.load(file)
    };
  } catch(err) {}  
}

data.themes.metadata.forEach(function(post) {
  
  test('theme: ' + post.theme, function(t) {
    
    t.ok(post.theme, 'must have a theme name');
    t.ok(post.emoji, 'must have emoji');
    var emojis = post.emoji.split(' ');
    
    emojis.forEach(function(emoji){
      t.notEqual(emojiSet.indexOf(emoji),-1, '"' + emoji + '" emoji must exist in set, see images/emoji/');
    })
    
    t.equal(emojis.length,2,'must have two emojis');
    
    t.end();
  });
});

images.forEach(function(image) {
  test('image: ' + image, function(t) {
    t.ok(isImage(image), 'image must be png')
    t.end();
  });
});
