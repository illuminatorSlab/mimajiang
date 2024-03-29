const preset = [
  {
    name: "15位密码",
    length: 15,
    length_num: 9,
    special: [
      {
        char: "_",
        pos: [13]
      }
    ]
  },
  {
    name: "18位密码",
    length: 18,
    length_num: 7,
    special: [
      {
        char: "_",
        pos: [6]
      },
      {
        char: "@",
        pos: [10]
      }
    ]
  },
  {
    name: "12位密码",
    length: 12,
    length_num: 4,
    special: [
      {
        char: "_",
        pos: [3]
      }
    ]
  },
  {
    name: "6位数字",
    length: 6,
    length_num: 6,
    special: []
  },
  {
    name: "8位数字",
    length: 8,
    length_num: 8,
    special: []
  },
];

export default preset;