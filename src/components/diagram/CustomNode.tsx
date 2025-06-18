import { Node, NodeProps } from "reactflow";
import { InputType, NewClass, SClass } from "@/interfaces/taxonomy";

type NodeData = {
  input: InputType;
};

type CustomNode = Node<NodeData>;

export function MyCustomNode({ data }: NodeProps<NodeData>) {
  if (data.input.one_choice) {
    return OneChoice(data.input);
  }
  if (data.input.multi_choice) {
    return MultiChoice(data.input);
  }
  if (data.input.newClass) {
    return NewClass(data.input);
  }
  if (data.input.double === "" || data.input.double !== undefined) {
    return Double(data.input);
  }
  if (data.input.text) {
    return Text(data.input);
  }
  if (data.input.specialClass) {
    return SpecialClass(data.input);
  }
}

function SpecialClass(input: InputType) {
  let list: SClass[] = input.specialClass ?? [];

  return (
    <div>
      {list
        .filter((item) => item.active && item.one_choice?.value !== "")
        .map((item, index) => {
          return (
            <div key={index}>
              {item.label} :
              <OneChoice one_choice={item.one_choice} />
              <SpecialMultiChoice multi_choice={item.multi_choice} />
            </div>
          );
        })}
    </div>
  );
}
function OneChoice(input: InputType) {
  let value = input.one_choice?.value;
  let list = input.one_choice?.list;
  let label: string = "";
  if (value !== "") {
    input.one_choice?.list?.forEach((choice) => {
      if (choice.id === input.one_choice?.value) {
        label = choice.label;
      }
    });

    return <a> {label}</a>;
  } else {
    return <></>;
  }
}

function MultiChoice(input: InputType) {
  let value = input.multi_choice?.value;
  let list = input.multi_choice?.list;
  let label: string[] = [];
  if (value) {
    list?.forEach((choice) => {
      value?.forEach((choice2) => {
        if (choice.id === choice2) {
          label.push(choice.label);
        }
      });
    });

    return (
      <div>
        <div className="grid grid-cols-2 pt-2">
          {label.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

function SpecialMultiChoice(input: InputType) {
  let value = input.multi_choice?.value;
  let list = input.multi_choice?.list;
  let labels: string[] = [];
  if (value) {
    list?.forEach((choice) => {
      value?.forEach((choice2) => {
        if (choice.id === choice2) {
          labels.push(choice.label);
        }
      });
    });

    return (
      <a>
        <a className="pt-2">{labels.join(", ")}</a>
      </a>
    );
  } else {
    return <></>;
  }
}

function NewClass(input: InputType) {
  let list: NewClass[] = input.newClass ?? [];

  return (
    <div className="grid grid-cols-2 pt-2">
      {list
        .filter((item) => item.active)
        .map((item, index) => (
          <div key={index}>
            <li>
              {item.label}
              {item.value !== "" && <a> : {item.value}</a>}
            </li>
          </div>
        ))}
    </div>
  );
}

function Double(input: InputType) {
  const double: string | undefined = input.double;
  {
    if (double !== "") {
      return <a>{double}</a>;
    } else {
      return <a className="text-red-500 font-bold">To be declared</a>;
    }
  }
}

function Text(input: InputType) {
  let text = input.text;

  return <div>{text}</div>;
}
