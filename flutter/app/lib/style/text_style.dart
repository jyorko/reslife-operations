import 'package:flutter/material.dart';

class AppTextStyles {
  // Regular text styles for the app

  // title on task card
  static const TextStyle cardTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: Colors.black,
  );

  // title in task detail
  static const TextStyle detailTitle = TextStyle(
    fontSize: 26,
    fontWeight: FontWeight.w700,
    color: Colors.black,
  );

  // sub title of content in task detail, such as 'location', 'due date', 'Assigned to'
  static const TextStyle detailHeading = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: Colors.black54,
  );
  // leading content in task detail, such as 'due date', 'location', 'Assigned to'
  static const TextStyle detailItemTitle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: Colors.black,
  );

  // content in task detail, such as 'desctiption', 'tools'
  static const TextStyle detailBodyText = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: Colors.black,
  );

  // colored text
  static TextStyle coloredText(String text) {
    Color color = const Color.fromARGB(255, 255, 172, 17);
    if (text == 'Complete') {
      color = const Color.fromARGB(255, 66, 178, 70);
    } else if (text == 'On-Going') {
      color = const Color.fromARGB(255, 54, 114, 217);
    }
    return TextStyle(
      fontSize: 16,
      fontWeight: FontWeight.w700,
      color: color,
    );
  }

}
