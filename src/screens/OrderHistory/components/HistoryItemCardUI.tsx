import * as React from "react";
import { ORDER_HISTORY_TYPE_COLOR } from '../index';
import View from '../../../components/atoms/View';
import Card from '../../../components/organisms/Card';
import { initColors } from '../../../res/colors';
import { historyItemFuncStyles } from '../styles';
import VectorIcon from "../../../components/atoms/VectorIcon";
import Text from "../../../components/atoms/Text";
import { VALIDATION_CHECK } from "../../../helpers/SharedActions";
import NavigationService from "../../../navigations/NavigationService";
import ROUTES from "../../../navigations/ROUTES";

interface Props {
    children?: any;
    colors?: typeof initColors;

    isDelivered?: boolean;
    orderID?: string | number;
    noOfPitstops?: string | number;
    dateTime?: string | number;

    onPress?: () => void;
    disabled?: boolean;
};

const defaultProps = {
    colors: initColors,
    onPress: undefined,
    disabled: false,
}

const HistoryItemCardUI = (props: Props) => {
    const colors = props?.colors ?? defaultProps.colors;

    const historyItemStyles = historyItemFuncStyles(colors);

    const dotColor = () => {
        return props.isDelivered ? ORDER_HISTORY_TYPE_COLOR.delivered : ORDER_HISTORY_TYPE_COLOR.cancelled;
    }
    const deliveryStatus = () => {
        return props.isDelivered ? 'Order Delivered' : 'Cancelled';
    }

    return (
        <Card contentContainerStyle={historyItemStyles.contentContainerStyle}
            {...(!props.disabled) && {
                onPress: () => {
                    if (props.onPress) {
                        props.onPress();
                    } else {
                        const navigationParams = {
                            orderID: props?.orderID ?? 0,
                            isDelivered: props?.isDelivered ?? false,
                            noOfPitstops: props?.noOfPitstops ?? '',
                            dateTime: props?.dateTime ?? '',

                        };
                        NavigationService.NavigationActions.common_actions.navigate(ROUTES.APP_DRAWER_ROUTES.OrderHistoryDetail.screen_name, navigationParams);
                    }
                }
            }}
            wait={0}
            activeOpacity={0.5}
            useScale>
            <View style={{ ...historyItemStyles.cubeIconContainer, backgroundColor: dotColor(), }}>
                <VectorIcon name='cube-outline' size={40} color={colors.white} />
            </View>

            <View style={historyItemStyles.bodyPrimaryContainer}>
                <View style={historyItemStyles.orderPitstopContainer}>
                    <Text fontFamily='PoppinsMedium' style={historyItemStyles.orderText}>{`Order ID: ${props.orderID}`}</Text>
                    <Text fontFamily='PoppinsMedium' style={historyItemStyles.noPitstopText}>{`${`${props.noOfPitstops}`.padStart(2, '0')} Pitstops`}</Text>
                </View>

                <View style={historyItemStyles.deliveryStatusContainer}>
                    <View style={historyItemStyles.orderDeliveredContainer}>
                        <View style={{ ...historyItemStyles.orderDeliveredDot, backgroundColor: dotColor(), }} />
                        <Text fontFamily='PoppinsMedium' style={historyItemStyles.orderDeliveredText}>{`${deliveryStatus()}`}</Text>
                    </View>
                    {VALIDATION_CHECK(props.dateTime) &&
                        <View style={{ ...historyItemStyles.datetimeContainer, backgroundColor: dotColor(), }}>
                            <Text style={historyItemStyles.dateTimeText}>{`${props.dateTime}`}</Text>
                        </View>
                    }
                </View>

            </View>
        </Card>
    )
}
HistoryItemCardUI.defaultProps = defaultProps;
export default HistoryItemCardUI;
