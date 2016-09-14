/**
 * Created by moriyasei on 2016/09/13.
 */


const markdown2hatenak = (input) => {
  let text = input;
  // Headline
  text = text.replace(/^([\#]{1,4})/mg, function () {return arguments[0].replace(/\#/g, '$')});

  // table none

  // pre none

  // blockquote
  text = text.replace(/^> ([\s\S]*?)\n\n/mg, function() {
    return '>>\n' + arguments[1] + '\n<<\n';
  });

  // list
  text = text.replace(/^((?:[ ]{4})+)\-/mg, function () {
    return arguments[1].replace(/[ ]{4}/g,'-') + '-';
  });
  text = text.replace(/^([ ]+)?(?:[0-9]+\.)/mg, function () {
    return ((arguments[1]) ? arguments[1].replace(/[ ]{4}/g,'+') : '' ) + '+';
  });

  // link
  text = text.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/mg, function () {
    return '[' + arguments[2] + ':title='+ arguments[1] + ']';
  });

  return text;
};

const hatenak2textile = (input) => {
  let text = input;
  // Headline
  var headline = function() {return 'h' + (arguments[1].split('$').length - 1) + '. ' + arguments[2] + '\n'}
  text = text.replace(/^([\$]{1,4})(.*)/mg, headline);

  // table
  text = text.replace(/\|\*([.^\|]*)/mg, function() {return '|_. ' + arguments[1];});

  // pre
  text = text.replace(/^\>\|(.*)\|\n([\s\S]*?)\n\|\|\</mg, function() {
    if (arguments[1]) {
      return '<pre><code class="'+ arguments[1] + '">\n' + arguments[2] + '\n</code></pre>\n';
    } else {
      return '<pre>\n' + arguments[2] + '\n</pre>\n';
    }
  });

  // blockquote
  text = text.replace(/^\>\>\n([\s\S]*?)\n\<\</mg, function() {
    return 'bq.' + arguments[1] + '\n';
  });

  // list
  text = text.replace(/^([\-]+)/mg, function () {return arguments[0].replace(/\-/g, '*')});
  text = text.replace(/^([\+]+)/mg, function () {return arguments[0].replace(/\+/g, '#')});

  // link
  text = text.replace(/\[(https?:\/\/.*?)(?:\:title=(.*?))\]/mg, function () {
    return '"' + arguments[2] + '":' + arguments[1] + " ";
  });

  // index
  text = text.replace(/^\[\:contents\]/g,"{{>toc}}");

  return text;
};

const compose = (fn1) => (fn2) => {
  return (arg) => fn2(fn1(arg))
};

const markdown2Textile = compose(markdown2hatenak)(hatenak2textile);
export { markdown2Textile };



