const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/users");  // قم بتعديل المسار بناءً على مكان نموذج المستخدم في مشروعك
const Disability = require("../models/disability");  // قم بتعديل المسار بناءً على مكان نموذج الإعاقة في مشروعك


mongoose.connect('mongodb://localhost:27017/ieltsExam', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

let disability = async () => {
      // إدراج البيانات الخاصة بالإعاقات
      return await Disability.create({
        name: "عدم القدره علي نطق حرف الباء",
        description: "عدم القدره علي نطق حرف الباء",
        image: "0.4535069939727103ب.png--",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  }

  
let user = async() => {
    let dis = await disability()
    console.log(dis)
      // إدراج بيانات المستخدمين
      const user = new User({
        name: "ahmed reda",
        email: "ahmed@ahmed.com",
        age: 22,
        password: bcrypt.hashSync("01024756410ahmed", 10),
        gender: true,
        isAdmin: true,
        isDoctor: true,
        active: true,
        image: "0.00387338867850362ssssss.png--",
        Disability: [dis._id],  // استخدام _id من الإعاقة التي تم إدراجها
        createdAt: new Date(),
        updatedAt: new Date(),
      });

       user.save();
}

user()