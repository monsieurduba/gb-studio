import l10n from "../helpers/l10n";

export const id = "EVENT_CASE";

export const fields = [].concat(
  [
    {
      key: "variable",
      type: "variable",
      defaultValue: "LAST_VARIABLE"
    },
    {
      key: "choices",
      label: "Number of cases",
      type: "number",
      min: 1,
      max: 16,
      defaultValue: 1
    }
  ],
  Array(16)
    .fill()
    .reduce((arr, _, i) => {
      arr.push({
        key: `__collapseCase${i}`,
        label: `${l10n("FIELD_WHEN")}: $$value${i}$$`,
        conditions: [
          {
            key: "choices",
            gt: i
          }
        ],
        type: "collapsable",
        defaultValue: false
      });
      arr.push({
        key: `value${i}`,
        label: l10n("FIELD_VALUE"),
        conditions: [
          {
            key: `__collapseCase${i}`,
            ne: true
          },
          {
            key: "choices",
            gt: i
          }
        ],
        type: "number",
        min: 0,
        max: 255,
        defaultValue: i
      });
      arr.push({
        key: `true${i}`,
        conditions: [
          {
            key: `__collapseCase${i}`,
            ne: true
          },
          {
            key: "choices",
            gt: i
          }
        ],
        type: "events"
      });
      return arr;
    }, []),
  [
    {
      key: "__collapseElse",
      label: l10n("FIELD_ELSE"),
      type: "collapsable",
      defaultValue: false
    },
    {
      key: "false",
      conditions: [
        {
          key: "__collapseElse",
          ne: true
        }
      ],
      type: "events"
    }
  ]
);

export const compile = (input, helpers) => {
  const { caseVariableValue } = helpers;

  caseVariableValue(
    input.variable,
    Array(input.choices)
      .fill()
      .reduce((memo, _, i) => {
        console.log("input", i, input, `value${i}`, input[`value${i}`]);
        const value = input[`value${i}`];
        const key = Number.isInteger(parseInt(value, 10)) ? value : i;
        if (!memo[key]) {
          return {
            ...memo,
            [key]: input[`true${i}`]
          };
        }
        return memo;
      }, {}),
    input.false
  );

  // for(var i =0)
  // ifVariableValue(input.variable, "==", input.value0, input.true0);

  // console.log(input);

  // const { textChoice } = helpers;
  // const { variable, trueText, falseText } = input;
  // textChoice(variable, { trueText, falseText });
};
