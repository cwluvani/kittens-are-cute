let person = {};
Object.defineproperty(person, 'name', {
  writable: false;
  value: 'Nicholas'
});
//Object.defineProperty() method => change the default property - [[...]]
console.log(person.name); //Nicholas
person.name = 'Greg';
console.log(person.name); //Nicholas


// 访问器属性
[[Configuarable]]
[[Enumerable]]
[[Get]]
[[Set]]

//访问器属性是不能直接定义的，必须使用 Object.defineProperty()。

let book = {
  year_:2000,
  edition: 1
};

Object.defineProperty(book, 'year', {
  get() {
     return this.year_;
  },
  set(newValue) {
    if (newValue > 2000) {
      this.year_ = newValue;
      this.edition += newValue - 2017;
    }
  }
  });
  
  book.year = 2018;
  console.log(book.edition); //2


//定义多个属性
Object.defineProperties();

//读取属性的特性

Object.getOwnPropertyDescriptor();

这个方法接收两个参数：属性所在的对象和要取得其描述符的属性名。返回值是一个对象，对于访问器属性包含
configurable、enumerable、get 和 set 属性，对于数据属性包含 configurable、enumerable、writable 和 value 属性。

let book = {};

Object.defineProperties(book, {
  year_: {
    value:2000
  },
  edition: {
    value: 2
  },
  year: {
    get() {
      return this.year_;
    },
    set(new_value) {
      if (new_value > 2011) {
        this.year_ = new_value;
        this.edition += new_value - 2011
      }
    }
  }
});

let descriptor = Object.getOwnPropertyDescriptor(book, "year_");
...
let descriptor = Object.getOwnPropertyDescriptor(book, "year");
...

对于数据属性 year_，value 等于原来的值，configurable 是 false，get 是 undefined。
对于访问器属性 year，value 是 undefined，enumerable 是 false，get 是一个指向获取函数的指针。


ECMAScript 2017 新增了 Object.getOwnPropertyDescriptors()静态方法。这个方法实际上
会在每个自有属性上调用 Object.getOwnPropertyDescriptor()并在一个新对象中返回它们。

//合并对象
//把原对象所有的本地属性一起复制到目标对象上
Object.assign()

这个方法接收一个目标对象和一个或多个源对象作为参数，然后将每个源对象中可枚举（Object.propertyIsEnumerable()返回 true）
和自有（Object.hasOwnProperty()返回 true）属性复制到目标对象。以字符串和符号为键的属性
会被复制。对每个符合条件的属性，这个方法会使用源对象上的[[Get]]取得属性的值，然后使用目标对象上的[[Set]]设置属性的值。

let dest, src, result;

dest = {};
src = {id: 'src'};

result = Object.assign(dest, src);

console.log(dest === result); // true
console.log(dest !== src); // true
console.log(result); // { id: src }
console.log(dest); // { id: src } 

dest = {
  set a(val) {
    console.log(`invoked dest setter with param ${val}`);
  }
};
src = {
  get a() {
    console.log('Invoked src getter');
    return 'foo';
  }
};
Object.assign(dest, src);
// 调用 src 的获取方法
// 调用 dest 的设置方法并传入参数"foo"
// 因为这里的设置函数不执行赋值操作
// 所以实际上并没有把值转移过来
console.log(dest); // { set a(val) {...} }

Object.assign(); 是浅复制

如果赋值期间出错，则操作会中止并退出，同时抛出错误。Object.assign()没有“回滚”之前
赋值的概念，因此它是一个尽力而为、可能只会完成部分复制的方法。


//对象表示及相等判定
ECMAScript 6 规范新增了 ·Object.is()·，这个方法与===很像，但同时也考虑
到了上述边界情形。这个方法必须接收两个参数

console.log(Object.is(NaN, NaN));

//超过两个值
function recursivelyCheckEqual (x, ...rest) {
  return Object.is(x, rest[0]) &&
    (rest.length < 2 || recursivelyCheckEqual(...rest));
}


//增强的对象语法
//！importan

1. 简写属性名只要使用变量名（不用再写冒号）就会自动被解释为同名的属性键。如果没有找到同名变量，则会抛出 ReferenceError。
let name = 'Matt';
let person = {
  name
};


2. 可计算属性
有了可计算属性，就可以在对象字面量中完成动态属性赋值。中括号包围的对象属性键告诉运行时
将其作为 JavaScript 表达式而不是字符串来求值：

const nameKey = 'name';
const ageKey = 'age';
const jobKey = 'job';

let person = {
  [nameKey]: 'Matt',
  [ageKey]: 27,
  [jobKey]: 'Software engineer'
}

3. 简写方法名

let person = {
  sayName(name) {
    console.log(`My name is ${name}`);
  }
}

person.sayName('Matt');

简写方法名对获取函数和设置函数也是适用的：
let person = {
 name_: '',
 get name() {
 return this.name_;
 },
 set name(name) {
 this.name_ = name;
 },
 sayName() {
 console.log(`My name is ${this.name_}`);
 }
};
person.name = 'Matt';
person.sayName(); // My name is Matt
简写方法名与可计算属性键相互兼容：
const methodKey = 'sayName';
let person = {
 [methodKey](name) {
 console.log(`My name is ${name}`);
 }
}
person.sayName('Matt'); // My name is Matt


//对象解构

let person = {
  name: 'Matt';
  age: 22
};

let {name: personName, age: personAge} = person;

console.log(personName); //Matt
console.log(personAge); //22

let person = {
 name: 'Matt',
 age: 27
};
let { name, age } = person;
console.log(name); // Matt
console.log(age); // 27


// 引用值不存在
let person = {
 name: 'Matt',
 age: 27
};
let { name, job } = person;
console.log(name); // Matt
console.log(job); // undefined 

//解构在内部使用函数 ToObject()

let personName, personAge;
...
/// 给事先声明的变量赋值
({name: personName, age: personAge} = person);

// 嵌套解构

let person = {
 name: 'Matt',
 age: 27,
 job: {
 title: 'Software engineer'
 }
}; 

let personCopy = {};

({ 
  name: personCopy.name,
  age: personCopy.age,
  job: personCopy.job
} = person);


//部分解构

try {
 // person.foo 是 undefined，因此会抛出错误
 ({name: personName, foo: { bar: personBar }, age: personAge} = person);
} catch(e) {}
console.log(personName, personBar, personAge);
// Matt, undefined, undefined

//参数上下文匹配

let person = {
  name: 'Matt',
  age: 27
};

function printPerson( foo, {name, age}, bar) {
  console.log(arguments);
  console.log(name, age);
}

printPerson('1st', person, '2nd');
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27



//创建对象

//ES6 的类都仅仅是封装了 ES5.1 构造函数加原型继承的语法糖而已。

//工厂模式

function createPerson(name, age, job) {
 let o = new Object();
 o.name = name;
 o.age = age;
 o.job = job;
 o.sayName = function() {
 console.log(this.name);
 };
 return o;
}
let person1 = createPerson("Nicholas", 29, "Software Engineer");
let person2 = createPerson("Greg", 27, "Doctor");
//这种工厂模式虽然可以解决创建多个类似对象的问题，但没有解决对象标识问题（即新创建的对象是什么类型）。


// 构造函数模式

像 Object 和 Array 这样的原生构造函数，运行时可以直接在执行环境中使用。
当然也可以自定义构造函数，以函数的形式为自己的对象类型定义属性和方法。

function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    console.log(this.name);
  };
  
}

let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");
person1.sayName(); // Nicholas
person2.sayName(); // Greg 

Person()构造函数代替了 createPerson()工厂函数。实际上，Person()内部
的代码跟 createPerson()基本是一样的，只是有如下区别。
 没有显式地创建对象。
 属性和方法直接赋值给了 this。
 没有 return。


//Tip: 构造函数的函数名首字母大写，毕竟 ECMAScript 的构造函数就是能创建对象的函数。

上一个例子的最后，person1 和 person2 分别保存着 Person 的不同实例。这两个对象都有一个constructor 属性指向 Person

##构造函数也是函数
构造函数与普通函数唯一的区别就是调用方式不同。除此之外，构造函数也是函数

任何函数只要使用 new 操作符调用就是构造函数，
而不使用 new 操作符调用的函数就是普通函数。
比如，前面的例子中定义的 Person()可以像下面这样调用：

// 作为构造函数
let person = new Person("Nicholas", 29, "Software Engineer");
person.sayName(); // "Nicholas"
// 作为函数调用
Person("Greg", 27, "Doctor"); // 添加到 window 对象
window.sayName(); // "Greg"
// 在另一个对象的作用域中调用
let o = new Object();
Person.call(o, "Kristen", 25, "Nurse");
o.sayName(); // "Kristen" 


//构造函数的问题

我们知道，ECMAScript 中的函数是对象，因此每次定义函数时，都会
初始化一个对象。逻辑上讲，这个构造函数实际上是这样的：
function Person(name, age, job){
 this.name = name;
 this.age = age;
 this.job = job;
 this.sayName = new Function("console.log(this.name)"); // 逻辑等价
} 

每个 Person 实例都会有自己的 Function 实例用于显
示 name 属性。当然了，以这种方式创建函数会带来不同的作用域链和标识符解析。但创建新 Function
实例的机制是一样的。因此不同实例上的函数虽然同名却不相等，如下所示：
console.log(person1.sayName == person2.sayName); // false

因为都是做一样的事，所以没必要定义两个不同的 Function 实例。况且，this 对象可以把函数
与对象的绑定推迟到运行时。
要解决这个问题，可以把函数定义转移到构造函数外部：
function Person(name, age, job){
 this.name = name;
 this.age = age;
 this.job = job;
 this.sayName = sayName;
}
function sayName() {
 console.log(this.name);
}
let person1 = new Person("Nicholas", 29, "Software Engineer");
let person2 = new Person("Greg", 27, "Doctor");
person1.sayName(); // Nicholas
person2.sayName(); // Greg 


//原型模式


每个 函数 都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法

  function Person() {}
  Person.prototype.name = "Nicholas";
  Person.prototype.age = 29;
  Person.prototype.job = "Software Engineer";
  Person.prototype.sayName = function() {
   console.log(this.name);
  };
  let person1 = new Person();
  person1.sayName(); // "Nicholas"
  let person2 = new Person();
  person2.sayName(); // "Nicholas"
  console.log(person1.sayName == person2.sayName); // true 
  
// 理解原型

无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个 prototype 属性（指向原型对象）。
默认情况下，所有原型对象自动获得一个名为 constructor 的属性，指回与之关联的构造函数。

__proto__属性，通过这个属性可以访问对象的原型。

关键在于理解这一点：实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有。

function Person() {}

/**
 * 声明之后，构造函数就有了一个
 * 与之关联的原型对象：
 */
console.log(typeof Person.prototype);
console.log(Person.prototype);
// {
// constructor: f Person(),
// __proto__: Object 
// }


/**
 * 正常的原型链都会终止于 Object 的原型对象
 * Object 原型的原型是 null
 */
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Person.prototype.__proto__.constructor === Object); // true
console.log(Person.prototype.__proto__.__proto__ === null); // true
console.log(Person.prototype.__proto__);
// {
// constructor: f Object(),
// toString: ...
// hasOwnProperty: ...
// isPrototypeOf: ...
// ... 


let person1 = new Person(),
 person2 = new Person();
/**
 * 构造函数、原型对象和实例
 * 是 3 个完全不同的对象：
 */
console.log(person1 !== Person); // true
console.log(person1 !== Person.prototype); // true
console.log(Person.prototype !== Person); // true 


/**
 * 实例通过__proto__链接到原型对象，
 * 它实际上指向隐藏特性[[Prototype]]
 *
 * 构造函数通过 prototype 属性链接到原型对象
 *
 * 实例与构造函数没有直接联系，与原型对象有直接联系
 */ 
 
 /**
 * 同一个构造函数创建的两个实例
 * 共享同一个原型对象：
 */
console.log(person1.__proto__ === person2.__proto__); // true

console.log(person1 instanceof Person); // true
console.log(person1 instanceof Object); // true
console.log(Person.prototype instanceof Object); // true 


console.log(Person.prototype.isPrototypeOf(person1)); // true
console.log(Person.prototype.isPrototypeOf(person2)); // true 


ECMAScript 的 Object 类型有一个方法叫 Object.getPrototypeOf()，返回参数的内部特性
[[Prototype]]的值。例如：
console.log(Object.getPrototypeOf(person1) == Person.prototype); // true
console.log(Object.getPrototypeOf(person1).name); // "Nicholas" 


Object 类型还有一个 setPrototypeOf()方法，可以向实例的私有特性[[Prototype]]写入一
个新值。这样就可以重写一个对象的原型继承关系：
let biped = {
 numLegs: 2
};
let person = {
 name: 'Matt'
};
Object.setPrototypeOf(person, biped);
console.log(person.name); // Matt
console.log(person.numLegs); // 2
console.log(Object.getPrototypeOf(person) === biped); // true

!!!!!!!!!!!!!!慎重修改原型关系!!!!!!!!!!!!!!!!

为避免使用 Object.setPrototypeOf()可能造成的性能下降，可以通过 Object.create()来创
建一个新对象，同时为其指定原型：
let biped = {
 numLegs: 2
};
let person = Object.create(biped);
person.name = 'Matt';
console.log(person.name); // Matt
console.log(person.numLegs); // 2
console.log(Object.getPrototypeOf(person) === biped); // true 
 
 

//原型层级

在通过对象访问属性时，会按照这个属性的名称开始搜索。搜索开始于对象实例本身。如果在这个
实例上发现了给定的名称，则返回该名称对应的值。如果没有找到这个属性，则搜索会沿着指针进入原
型对象，然后在原型对象上找到属性后，再返回对应的值。因此，在调用 person1.sayName()时，会
发生两步搜索。首先，JavaScript 引擎会问：“person1 实例有 sayName 属性吗？”答案是没有。然后，
继续搜索并问：“person1 的原型有 sayName 属性吗？”答案是有。于是就返回了保存在原型上的这
个函数。在调用 person2.sayName()时，会发生同样的搜索过程，而且也会返回相同的结果。这就是
原型用于在多个对象实例间共享属性和方法的原理。

tip：前面提到的 constructor 属性只存在于原型对象，因此通过实例对象也是可以访问到的。
不过，使用 delete 操作符可以完全删除实例上的这个属性，从而让标识符解析过程能够继续搜索原型对象。


hasOwnProperty() 
方法用于确定某个属性是在实例上还是在原型对象上。这个方法是继承自 Object
的，会在属性存在于调用它的对象实例上时返回 true，

注：ECMAScript 的 Object.getOwnPropertyDescriptor()方法只对实例属性有
效。要取得原型属性的描述符，就必须直接在原型对象上调用 Object.getOwnPropertyDescriptor()。


//原型和in操作符


只要通过对象可以访问，in 操作符就返回 true，而 hasOwnProperty()只有属性存在于实例上
时才返回 true。因此，只要 in 操作符返回 true 且 hasOwnProperty()返回 false，就说明该属性
是一个原型属性。来看下面的例子：

function Person() {}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";

Person.prototype.sayName = function() {
  console.log(this.name);
|;

let person = new Person();

console.log(hasPrototypeProperty(person, 'name')); //true
person.name = 'Greg';
console.log(hasPrototypeProperty(person, 'name')); //false


如果想列出所有实例属性，无论是否可以枚举，都可以使用 Object.getOwnPropertyNames()：
let keys = Object.getOwnPropertyNames(Person.prototype);
console.log(keys); // "[constructor,name,age,job,sayName]"


***对象迭代

Object.values()和 Object.entries()接收一个对象，返回它们内容的数组。Object.values()返回对象值的数组，Object.entries()返回键/值对的数组。

1. 其他原型语法
在前面的例子中，每次定义一个属性或方法都会把 Person.prototype 重
写一遍。为了减少代码冗余，也为了从视觉上更好地封装原型功能，直接通过一个包含所有属性和方法
的对象字面量来重写原型成为了一种常见的做法，如下面的例子所示：
function Person() {}
Person.prototype = {
 name: "Nicholas",
 age: 29,
 job: "Software Engineer",
 sayName() {
 console.log(this.name);
 }
}; 

constructor属性现在等于Object而不是 Person 了。
如果 constructor 的值很重要，则可以像下面这样在重写原型对象时专门设置一下它的值：
function Person() {
}
Person.prototype = {
 constructor: Person,
 name: "Nicholas",
 age: 29,
 job: "Software Engineer",
 sayName() {
 console.log(this.name);
 } 
 
 
 但要注意，以这种方式恢复 constructor 属性会创建一个[[Enumerable]]为 true 的属性。而
原生 constructor 属性默认是不可枚举的。因此，如果你使用的是兼容 ECMAScript 的 JavaScript 引擎，
那可能会改为使用 Object.defineProperty()方法来定义 constructor 属性：
function Person() {}
Person.prototype = {
 name: "Nicholas",
 age: 29,
 job: "Software Engineer",
 sayName() {
 console.log(this.name);
 }
};
// 恢复 constructor 属性
Object.defineProperty(Person.prototype, "constructor", {
 enumerable: false,
 value: Person
}); 


//原型的动态性

记住，实例只有指向原型的指针，没有指向构造函数的指针。
重写构造函数上的原型之后再创建的实例才会引用新的原型。而在此之前创建的实例仍然会引用最初的原型。


//原生对象原型

//原型的问题

function Person() {}
Person.prototype = {
 constructor: Person,
 name: "Nicholas",
 age: 29,
 job: "Software Engineer",
 friends: ["Shelby", "Court"],
  sayName() {
 console.log(this.name);
 }
};
let person1 = new Person();
let person2 = new Person();
person1.friends.push("Van");
console.log(person1.friends); // "Shelby,Court,Van"
console.log(person2.friends); // "Shelby,Court,Van"
console.log(person1.friends === person2.friends); // true


##继承

//原型链

每个构造函数都有一个原型对象，原型有
一个属性指回构造函数，而实例有一个内部指针指向原型。如果原型是另一个类型的实例呢？那就意味
着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函
数。这样就  在实例和原型  之间构造了一条原型链。这就是原型链的基本构想。


1. 默认原型
实际上，原型链中还有一环。默认情况下，所有引用类型都继承自 Object，这也是通过原型链实现的。


2. 原型与继承关系
原型与实例的关系可以通过两种方式来确定。第一种方式是使用 instanceof 操作符，如果一个实
例的原型链中出现过相应的构造函数，则 instanceof 返回 true。

确定这种关系的第二种方式是使用 isPrototypeOf()方法。原型链中的每个原型都可以调用这个
方法，如下例所示，只要原型链中包含这个原型，这个方法就返回 true：
console.log(Object.prototype.isPrototypeOf(instance)); // true
console.log(SuperType.prototype.isPrototypeOf(instance)); // true
console.log(SubType.prototype.isPrototypeOf(instance)); // true

3. 关于方法
子类有时候需要覆盖父类的方法，或者增加父类没有的方法。为此，这些方法必须在原型赋值之后
再添加到原型上。来看下面的例子：
function SuperType() {
 this.property = true;
}
SuperType.prototype.getSuperValue = function() {
 return this.property;
};
function SubType() {
 this.subproperty = false;
}
// 继承 SuperType
SubType.prototype = new SuperType();
// 新方法
SubType.prototype.getSubValue = function () {
 return this.subproperty;
};
// 覆盖已有的方法
SubType.prototype.getSuperValue = function () {
 return false;
};
let instance = new SubType();
console.log(instance.getSuperValue()); // false

  
###原型链的问题
  
// 主要问题出现在原型中包含引用值的时候。前面在谈到原型的问题时也提到过，
//原型中包含的引用值会在所有实例间共享，这也是为什么属性通常会在构造函数中定义而不会定义在原型上的原因。
  
function SuperType() {
    this.colors = ['red', 'blue', 'gree'];
}
  
function SubType() {}
  
SubType.prototype = new SuperType();
  
let instance1 = new SubType();
instance1.colors.push('black');
console.log(instance1.colors); // 'red,blue,gree,black'

let instance2 = new SubType();
console.log(instance2.colors); // ...same as above
  
// 原型链的第二个问题是，子类型在实例化时不能给父类型的构造函数传参。事实上，我们无法在不
// 影响所有对象实例的情况下把参数传进父类的构造函数。再加上之前提到的原型中包含引用值的问题，
// 就导致原型链基本不会被单独使用。

##盗用构造函数

// 在子类构造函数中调用父类构造函数。因为毕竟函数就是在特定上下文中执行代码的简单对象，所以可以使用
// apply()和 call()方法以新创建的对象为上下文执行构造函数。

function SuperType() {
  this.colors = ['red', 'blue', 'green']
}
  
function SubType() {
  SuperType.call(this);
}
 
let instance1 = new SubType();
instance.colors.push('black');
console.log(instance1.colors); // 'red, blue, green, black'

  
let instance2 = new SubType();
console.log(instance2.colors); // 'red, blue, green'


//1.传递参数
  
// 相比于使用原型链，盗用构造函数的一个优点就是可以在子类构造函数中向父类构造函数传参。来
// 看下面的例子：
function SuperType(name){
 this.name = name;
}
function SubType() {
 // 继承 SuperType 并传参
 SuperType.call(this, "Nicholas");
 // 实例属性
 this.age = 29;
}
let instance = new SubType();
console.log(instance.name); // "Nicholas";
console.log(instance.age); // 29 
  
##组合继承

// 基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。
// 这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。


function SuperType(name) {
   this.name = name;
   this.colors = ['red', 'blue', 'green'];
}
  
SuperType.protoType.sayName = function() {
  console.log(this.name);
};
  
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
  
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function() {
  console.log(this.age);
}
  
let instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
console.log(instance1.colors);// "red,blue,green,black"
  
instance1.sayName(); // "Nicholas";
instance1.sayAge(); // 29 
  
let instance2 = new SubType("Greg", 27);
console.log(instance2.colors); // "red,blue,green"
instance2.sayName(); // "Greg";
instance2.sayAge(); // 27 
  

###原型式继承

function object(o) {
 function F() {}
 F.prototype = o;
 return new F();
} 
  
// 这个 object()函数会创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，然后返
// 回这个临时类型的一个实例。本质上，object()是对传入的对象执行了一次浅复制。

  
// 原型式继承适用于这种情况：你有一个对象，想在     它的基础上      再创建一个新对象。
// 你需要把这个对象先传给 object()，然后再对返回的对象进行适当修改。
  
#ECMAScript 5 通过增加` Object.create()  `方法将原型式继承的概念规范化了。
  
//  Object.create()的第二个参数与 Object.defineProperties()的第二个参数一样：每个新增
// 属性都通过各自的描述符来描述。以这种方式添加的属性会遮蔽原型对象上的同名属性。比如：
let person = {
 name: "Nicholas",
 friends: ["Shelby", "Court", "Van"]
};
let anotherPerson = Object.create(person, {
 name: {
 value: "Greg"
 }
});
console.log(anotherPerson.name); // "Greg" 
  
  
##寄生式继承parasitic inheritance

// 寄生式继承背后的思路类似于寄生构造函数和工厂模式：
//创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象。
  

function createAnother(original) {
   let clone = object(original);  // 通过调用函数创建一个新对象
   clone.sayHi = function() {  // 以某种方式增强这个对象
     console.log('hi');
   };
   return clone;
}
// 增强了原型式继承
  
// 寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。object()函数不是寄生式
// 继承所必需的，任何返回新对象的函数都可以在这里使用。但是通过寄生世纪城添加函数会导致函数难以重用，与构造函数模式类似
  

  
##寄生式组合继承

//最主要的效率问题就是父类构造函数始终会被调用两次：一次在是创建子类原型时调用，另一次是在子类构造函数中调用。
//子类原型最终是要包含超类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了。

//基本思路是  不通过调用父类构造函数   给子类原型赋值，而是取得父类原型的一个副本。
//说到底就是使用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型。


function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype); //创建对象
  prototype.constructor = subType; //增强对象
  subType.prototype = prototype; //赋值对象
}
  
// 子类构造函数和父类构造函数。在这个函数内部，第一步是创建父类原型的一个副本。然后，给返回的
// prototype 对象设置 constructor 属性，解决由于重写原型导致默认 constructor 丢失的问题。最
// 后将新创建的对象赋值给子类型的原型。
 
  
//寄生式组合继承可以算是引用类型继承的最佳模式。
  
  
##类class
//ECMAScript 6 类表面上看起来可以支持正式的面向对象编程，但实际上它背后使用的仍然是原型和构造函数的概念。

###类定义

//类声明
class Person {}
const Animal = class {};
  
/另一个跟函数声明不同的地方是，函数受函数作用域限制，而类受块作用域限制：
  
// 类可以包含构造函数方法、实例方法、获取函数、设置函数和静态类方法，但这些都不是必需的。
// 空的类定义照样有效。默认情况下，类定义中的代码都在严格模式下执行。
  
class Foo {}
class Bar {
  constructor() {}
}
  
class Baz {
  get myBaz() {}
}
  
class Qux {
  static myQux() {}
}
 
  
//类表达式的名称是可选的。在把类表达式赋值给变量后，可以通过 name 属性取得类表达式的名称字符串。
  
  
 //类构造函数
 //方法名 constructor 会告诉解释器在使用 new 操作符创建类的新实例时，应该调用这个函数。
  
  1.实例化
  
  //默认情况下，类构造函数会在执行之后返回 this 对象。构造函数返回的对象会被用作实例化的对
// 象，如果没有什么引用新创建的 this 对象，那么这个对象会被销毁。不过，如果返回的不是 this 对
// 象，而是其他对象，那么这个对象不会通过 instanceof 操作符检测出跟类有关联，因为这个对象的原型指针没有被修改
  

class Person {
  constructor(override) {
     this.foo = 'foo';
     if (override) {
       return {
         bar: 'bar'
       };
     }
  }
}
  
let p1 = new Person();
    p2 = new Person(true);

console.log(p1);
console.log(p1 instanceof Person); // true
  
console.log(p2);
console.log(p2 instanceof Person); //false

  
// 类构造函数与构造函数的主要区别是，调用类构造函数必须使用 new 操作符。而普通构造函数如果
// 不使用 new 调用，那么就会以全局的 this（通常是 window）作为内部对象。调

function Person() {}
class Animal {}
  
let p = person(); //把window作为this来构建实例
let a = Animal(); //TypeError
  
 
##把类当成特殊的函数

class Person {}
console.log(Person); // class Person {}
console.log(typeof Person); // function 
  
//类标识符有 prototype 属性，而这个原型也有一个 constructor 属性指向类自身：

class Person {}

console.log(Person.prototype);  // { constructor: f() }
console.log(Person === Person.prototype.constructor); // true
  
// 如前所述，类本身具有与普通构造函数一样的行为。在类的上下文中，类本身在使用 new 调用时就
// 会被当成构造函数。重点在于，类中定义的 constructor 方法不会被当成构造函数，在对它使用
// instanceof 操作符时会返回 false。
  
  
//类是 JavaScript 的一等公民，因此可以像其他对象或函数引用一样把类作为参数传递：
  
// 类可以像函数一样在任何地方定义，比如在数组中
let classList = [
 class {
 constructor(id) {
 this.id_ = id;
 console.log(`instance ${this.id_}`);
 }
 }
];
function createInstance(classDefinition, id) {
 return new classDefinition(id);
}
let foo = createInstance(classList[0], 3141); // instance 3141
  
  
// 与立即调用函数表达式相似，类也可以   立即实例化：
// 因为是一个类表达式，所以类名是可选的
let p = new class Foo { 
  constructor(x) {
 console.log(x);
 }
}('bar'); // bar
console.log(p); // Foo {}
  

//  !important
  ##实例、原型和类成员
  
//类的语法可以非常方便地定义应该存在于实例上的成员、应该存在于原型上的成员，以及应该存在于类本身的成员。
  
 1. 实例成员
 
 //为新创建的实例（this）添加“自有”属性。至于添加什么样的属性，则没有限制。
 //每个实例都对应一个唯一的成员对象，这意味着所有成员都不会在原型上共享
 
  class Person {
 constructor() {
 // 这个例子先使用对象包装类型定义一个字符串
 // 为的是在下面测试两个对象的相等性
 this.name = new String('Jack');
 this.sayName = () => console.log(this.name);
 this.nicknames = ['Jake', 'J-Dog']
 }
}
let p1 = new Person(),
 p2 = new Person();
p1.sayName(); // Jack
p2.sayName(); // Jack
console.log(p1.name === p2.name); // false
console.log(p1.sayName === p2.sayName); // false
console.log(p1.nicknames === p2.nicknames); // false
p1.name = p1.nicknames[0];
p2.name = p2.nicknames[1];
p1.sayName(); // Jake
p2.sayName(); // J-Dog 
  
  
##原型方法与访问器
//为了在实例间共享方法，类定义语法把在类块中定义的方法作为原型方法。
  
  
class Person {
  constructor() {
    //添加进this的所有内容都会存在于不同的实例上
    this.locate = () => console.log('instance');
  }
  //在类块中定义的所有内容都会定义在类的原型上
  locate() {
    console.log('prototype');
  }
}

let p = new Person();
p.locate();  // instance
Person.prototype.locate(); //prototype
  
//可以把方法定义在类构造函数中或者类块中，但不能在类块中给原型添加原始值或对象作为成员数据：
class Person {
 name: 'Jake'
}
// Uncaught SyntaxError: Unexpected token
  
//类方法等同于对象属性，因此可以使用字符串、符号或计算的值作为键：
const symbolKey = Symbol('symbolKey');
class Person {
 stringKey() {
 console.log('invoked stringKey');
 }
 [symbolKey]() {
 console.log('invoked symbolKey');
 }
 ['computed' + 'Key']() {
 console.log('invoked computedKey');
 }
}
let p = new Person();
p.stringKey(); // invoked stringKey
p[symbolKey](); // invoked symbolKey
p.computedKey(); // invoked computedKey 
    
 //类定义也支持获取和设置访问器。语法与行为跟普通对象一样：
class Person {
 set name(newName) {
 this.name_ = newName;
 }
 get name() {
 return this.name_;
 }
}
let p = new Person();
p.name = 'Jake';
console.log(p.name); // Jake 
  
  
 3.静态类方法
 
//  静态类成员在类定义中使用 static 关键字作为前缀。在静态成员中，this 引用类自身。其他所有约定跟原型成员一样：
class Person {
 constructor() {
 // 添加到 this 的所有内容都会存在于不同的实例上
 this.locate = () => console.log('instance', this);
 }
 // 定义在类的原型对象上
 locate() {
 console.log('prototype', this);
 }
 // 定义在类本身上
 static locate() {
 console.log('class', this);
 }
}
let p = new Person();
p.locate(); // instance, Person {}
Person.prototype.locate(); // prototype, {constructor: ... }
Person.locate(); // class, class Person {} 
  
// 静态类方法非常适合作为实例工厂
  
class Person {
  constructor(age) {
    this.age_ = age;
  }
  
  sayAge() {
    console.log(this.age_);
  }
  
  static create() {
    return new Person(Math.floor(Math.random()*100));
  }
}
  
  console.log(Person.create()); // Person {age_: ...}
  
4. 非函数原型和类成员

//虽然类定义并不显式支持在原型或类上添加成员数据，但在类定义外部，可以手动添加：
class Person {
 sayName() {
 console.log(`${Person.greeting} ${this.name}`);
 }
} 
  
// 在类上定义数据成员
  
  Person.greeting = 'My name is';
  
 // 在原型上定义数据成员
  
 Person.prototype.name = 'Jake';
  
let p = new Person();
p.sayName(); // My name is Jake
    
// 注意 类定义中之所以没有显式支持添加数据成员，是因为在共享目标（原型和类）上添
// 加可变（可修改）数据成员是一种反模式。一般来说，对象实例应该独自拥有通过 this
// 引用的数据。

5. 迭代器与生成器方法
//类定义语法支持在原型和类本身上定义生成器方法：
calss Person {
  //在原型上定义生成器方法
  *createNicknameIterator() {
    yield 'Jack';
    yield 'Jake';
    yield 'J-Dog';
  }
  //在类上定义生成器方法
  static *createJobIterator() {
    yield 'Butcher';
   yield 'Baker';
   yield 'Candlestick maker';
 }
} 
  
let jobIter = Person.createJobIterator();
console.log(jobIter.next().value); // Butcher
console.log(jobIter.next().value); // Baker
console.log(jobIter.next().value); // Candlestick maker
let p = new Person();
let nicknameIter = p.createNicknameIterator();
console.log(nicknameIter.next().value); // Jack
console.log(nicknameIter.next().value); // Jake
console.log(nicknameIter.next().value); // J-Dog 
  
  
  
  //因为支持生成器方法，所以可以通过添加一个默认的迭代器，把类实例变成可迭代对象：
class Person {
 constructor() {
 this.nicknames = ['Jack', 'Jake', 'J-Dog'];
 }
 *[Symbol.iterator]() {
 yield *this.nicknames.entries();
 }
}
let p = new Person();
for (let [idx, nickname] of p) {
 console.log(nickname);
} 
  
// Jack
// Jake
// J-Dog
  
  //也可以只返回迭代器实例：
class Person {
 constructor() {
 this.nicknames = ['Jack', 'Jake', 'J-Dog'];
 }
 [Symbol.iterator]() {
 return this.nicknames.entries();
 }
}
let p = new Person();
for (let [idx, nickname] of p) {
 console.log(nickname);
}
// Jack
// Jake
// J-Dog 
  
  
  ## 继承
  
  //类继承使用的是新语法，但背后依旧使用的是原型链。
  
  1. 继承基础
  
//  ES6 类支持单继承。使用 extends 关键字，就可以继承任何拥有[[Construct]]和原型的对象。
// 很大程度上，这意味着不仅可以继承一个类，也可以继承普通的构造函数（保持向后兼容）：
  
class Vehicle {}
// 继承类
class Bus extends Vehicle {}
let b = new Bus();
console.log(b instanceof Bus); // true
console.log(b instanceof Vehicle); // true
function Person() {}
// 继承普通构造函数
class Engineer extends Person {}
let e = new Engineer();
console.log(e instanceof Engineer); // true
console.log(e instanceof Person); // true
  
  
//派生类都会通过原型链访问到类和原型上定义的方法。this 的值会反映调用相应方法的实例或者类
  
  class Vehicle {
    identifyPrototype(id) {
      console.log(id, this);
    }
    
    static identifyClass(id) {
      console.log(id, this);
    }
  }
  
  class Bus extends Vehicle {};
  
  let v = new Vehicle();
  let b - new Bus();
  
b.identifyPrototype('bus'); // bus, Bus {}
v.identifyPrototype('vehicle'); // vehicle, Vehicle {}
Bus.identifyClass('bus'); // bus, class Bus {}
Vehicle.identifyClass('vehicle'); // vehicle, class Vehicle {}
  
  
2. 构造函数、HomeObject 和 super()
  
// 派生类的方法可以通过 super 关键字引用它们的原型。
  
  //这个关键字只能在派生类中使用，
  //而且仅限于类构造函数、实例方法和静态方法内部。
  
  //在类构造函数中使用 super 可以调用父类构造函数。
  
  
  //在静态方法中可以通过 super 调用继承的类上定义的静态方法：
  
  class Vehicle {
    static identify() {
      console.log('vehicle');
    }
  }
  
  class Bus extends Vehicle {
    static identify() {
      super.identify();
    }
  }
  
  Bus.identify(); //vehicle
  
//  ES6 给类构造函数和静态方法添加了内部特性[[HomeObject]]，这个特性是一个
// 指针，指向定义该方法的对象。这个指针是自动赋值的，而且只能在 JavaScript 引擎内部
// 访问。super 始终会定义为[[HomeObject]]的原型。
  
  
  TIP:
  使用super时要注意几个问题
  
   super 只能在派生类构造函数和静态方法中使用。
class Vehicle {
 constructor() {
 super();
 // SyntaxError: 'super' keyword unexpected
 }
} 
  
   不能单独引用 super 关键字，要么用它调用构造函数，要么用它引用静态方法。
class Vehicle {}
class Bus extends Vehicle {
 constructor() {
 console.log(super);
 // SyntaxError: 'super' keyword unexpected here
 }
} 
  
   调用 super()会调用父类构造函数，并将返回的实例赋值给 this。
class Vehicle {}
class Bus extends Vehicle {
 constructor() {
 super();
 console.log(this instanceof Vehicle);
 }
}
new Bus(); // true 
  
  
   super()的行为如同调用构造函数，如果需要给父类构造函数传参，则需要手动传入。
class Vehicle {
 constructor(licensePlate) {
 this.licensePlate = licensePlate;
 }
}
class Bus extends Vehicle {
 constructor(licensePlate) {
 super(licensePlate);
 }
}
console.log(new Bus('1337H4X')); // Bus { licensePlate: '1337H4X' }
  
   如果没有定义类构造函数，在实例化派生类时会调用 super()，而且会传入所有传给派生类的
参数。
class Vehicle {
 constructor(licensePlate) {
 this.licensePlate = licensePlate;
 }
}
class Bus extends Vehicle {}
console.log(new Bus('1337H4X')); // Bus { licensePlate: '1337H4X' }
  
  
   在类构造函数中，不能在调用 super()之前引用 this。
class Vehicle {}
class Bus extends Vehicle {
 constructor() {
 console.log(this);
 }
}
new Bus();
// ReferenceError: Must call super constructor in derived class
// before accessing 'this' or returning from derived constructor
  
  
   如果在派生类中显式定义了构造函数，则要么必须在其中调用 super()，要么必须在其中返回
一个对象。
class Vehicle {}
class Car extends Vehicle {}
class Bus extends Vehicle {
 constructor() {
 super();
 }
}
class Van extends Vehicle {
 constructor() {
 return {};
 }
}
console.log(new Car()); // Car {}
console.log(new Bus()); // Bus {}
console.log(new Van()); // {} 
  
  
  3. 抽象基类
  
// 有时候可能需要定义这样一个类，它可供其他类继承，但本身不会被实例化。虽然 ECMAScript 没
// 有专门支持这种类的语法 ，但通过 new.target 也很容易实现。 
 // **new.target 保存通过 new 关键字调用的类或函数。***
  // 通过在实例化时检测 new.target 是不是抽象基类，可以阻止对抽象基类的实例化：
  
  // 抽象基类
class Vehicle {
 constructor() {
 console.log(new.target);
 if (new.target === Vehicle) {
 throw new Error('Vehicle cannot be directly instantiated'); 
    }
 }
}
// 派生类
class Bus extends Vehicle {}
new Bus(); // class Bus {}
new Vehicle(); // class Vehicle {}
// Error: Vehicle cannot be directly instantiated 
  
  
//   另外，通过在抽象基类构造函数中进行检查，可以要求派生类必须定义某个方法。因为原型方法在
// 调用类构造函数之前就已经存在了，所以可以通过 this 关键字来检查相应的方法：
  
// 抽象基类
class Vehicle {
 constructor() {
 if (new.target === Vehicle) {
 throw new Error('Vehicle cannot be directly instantiated');
 }
 if (!this.foo) {
 throw new Error('Inheriting class must define foo()');
 }
 console.log('success!');
 }
} 
  
  4. 继承内置类型
  
  //开发者可以方便地扩展内置类型
  
  //有些内置类型的方法会返回新实例。默认情况下，返回实例的类型与原始实例的类型是一致的：
class SuperArray extends Array {}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter(x => !!(x%2))
console.log(a1); // [1, 2, 3, 4, 5]
console.log(a2); // [1, 3, 5]
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // true
  
//如果想覆盖这个默认行为，则可以覆盖 Symbol.species 访问器，这个访问器决定在创建返回的实例时使用的类：
class SuperArray extends Array {
 static get [Symbol.species]() {
 return Array;
 }
}
let a1 = new SuperArray(1, 2, 3, 4, 5);
let a2 = a1.filter(x => !!(x%2))
console.log(a1); // [1, 2, 3, 4, 5]
console.log(a2); // [1, 3, 5]
console.log(a1 instanceof SuperArray); // true
console.log(a2 instanceof SuperArray); // false 
  
  
  5. 类混入
  
// 在下面的代码片段中，extends 关键字后面是一个 JavaScript 表达式。任何可以解析为一个类或一
// 个构造函数的表达式都是有效的。这个表达式会在求值类定义时被求值：
class Vehicle {}
function getParentClass() {
 console.log('evaluated expression');
 return Vehicle;
}
class Bus extends getParentClass() {}
  
//   混入模式可以通过在一个表达式中连缀多个混入元素来实现，这个表达式最终会解析为一个可以被
// 继承的类。如果 Person 类需要组合 A、B、C，则需要某种机制实现 B 继承 A，C 继承 B，
// 而 Person再继承 C，从而把 A、B、C 组合到这个超类中。实现这种模式有不同的策略。
//   一个策略是定义一组“可嵌套”的函数，每个函数分别接收一个超类作为参数，而将混入类定义为
// 这个参数的子类，并返回这个类。这些组合函数可以连缀调用，最终组合成超类表达式：
  
  class Vehicle {}
let FooMixin = (Superclass) => class extends Superclass {
 foo() {
 console.log('foo');
 }
};
let BarMixin = (Superclass) => class extends Superclass {
 bar() {
 console.log('bar');
 }
};
let BazMixin = (Superclass) => class extends Superclass {
 baz() {
 console.log('baz');
 }
};
class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))) {}
let b = new Bus();
b.foo(); // foo
b.bar(); // bar
b.baz(); // baz
  
//通过写一个辅助函数，可以把嵌套调用展开：
class Vehicle {}
let FooMixin = (Superclass) => class extends Superclass {
 foo() {
 console.log('foo');
 }
};
let BarMixin = (Superclass) => class extends Superclass {
 bar() {
 console.log('bar');
 }
};
let BazMixin = (Superclass) => class extends Superclass {
 baz() {
 console.log('baz');
 }
};
function mix(BaseClass, ...Mixins) {
 return Mixins.reduce((accumulator, current) => current(accumulator), BaseClass);
}
class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin) {}
let b = new Bus();
b.foo(); // foo
b.bar(); // bar
b.baz(); // baz 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  





