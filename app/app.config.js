angular.module('app').run(function ($log) {
    $log.info('App started');
});

// function MyException(message) {
//     this.name = 'MyException';
//     this.message= message;
// }
// MyException.prototype = new Error();
// MyException.prototype.constructor = MyException;
// Then, you can throw the exceptions as error objects:
//
//     throw new MyException('Something was wrong!');