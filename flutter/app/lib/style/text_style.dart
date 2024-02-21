import 'package:flutter/material.dart';

class AppTextStyles {
  // Regular text styles for the app

  // title on task card
  static const TextStyle titleOnCardStyle = TextStyle(
    fontSize: 26,
    fontWeight: FontWeight.w700,
    color: Colors.black,
  );

  // title in task detail
  static const TextStyle titleOnDetailStyle = TextStyle(
    fontSize: 26,
    fontWeight: FontWeight.w700,
    color: Colors.black,
  );

  // sub title of content in task detail, such as 'location', 'due date', 'Assigned to'
  static const TextStyle subTitleStyle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: Colors.black54,
  );
  // leading content in task detail, such as 'due date', 'location', 'Assigned to'
  static const TextStyle leadingContentStyle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: Colors.black,
  );

  // content in task detail, such as 'desctiption', 'tools'
  static const TextStyle contentStyle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: Colors.black,
  );
}