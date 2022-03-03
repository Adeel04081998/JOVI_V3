import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import RNDraggableFlatList, {
  RenderItem,
  RenderItemParams,
  ScaleDecorator
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = React.ComponentProps<typeof RNDraggableFlatList> & {
  children?: any;
  updateData?: (data: any) => void;
  renderItem?: RenderItem<any>;

};

const defaultProps = {
  updateData: undefined,
}

const DraggableFlatList = (props: Props) => {
  const activatedIndex = React.useRef(-1);
  const [activated, setActivated] = useState(false);

  const MyrenderItem = (itemProps: RenderItemParams<unknown>) => {
    return <ScaleDecorator>
      <TouchableOpacity
      activeOpacity={.8}
        onLongPress={itemProps.drag}
        disabled={itemProps.isActive}
        style={itemProps.isActive ? {
        // backgroundColor: "rgba(0,0,0,0.3)",
          opacity: 1,
        } : {
          // backgroundColor:activatedIndex.current!==-1 ? `rgba(0,0,0,0.3)` : '#fff',
        }}>
        {/* @ts-ignore */}
        <props.renderItem {...itemProps} />
      </TouchableOpacity>
    </ScaleDecorator>
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <RNDraggableFlatList
        {...props}
        keyExtractor={(item, index) => `${index}`}
        extraData={activated}
        onDragBegin={(index) => {
          // activatedIndex.current = index;
          // setActivated(true);
        }}
        onDragEnd={({ data }) => {
          // activatedIndex.current = -1;
          // setActivated(false);
          props.updateData && props.updateData(data)
        }}

        renderItem={(itemProps) => <MyrenderItem {...itemProps} />}
      />
    </GestureHandlerRootView>

  );
}

DraggableFlatList.defaultProps = defaultProps;
export default DraggableFlatList;
