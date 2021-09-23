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
















