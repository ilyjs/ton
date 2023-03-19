import React from "react";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { CustomData } from "./types";
import { TypeIcon } from "./TypeIcon";
import {TreeRoot, ExpandIconWrapper, LabelGridItem} from "./styles";

type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel["id"]) => void;
  onSelect: (node: NodeModel) => void;

};

export const CustomNode: React.FC<Props> = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleSelect = () => props.onSelect(props.node);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  return (
    <TreeRoot
      className={`tree-node`}
      style={{ paddingInlineStart: indent }}
      isSelected={props.isSelected}
      onClick={handleSelect}
    >
      <ExpandIconWrapper
        isOpen={props.isOpen}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRightIcon />
          </div>
        )}
      </ExpandIconWrapper>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <LabelGridItem>
        <Typography variant="body2">{props.node.text}</Typography>
      </LabelGridItem>
    </TreeRoot>
  );
};
