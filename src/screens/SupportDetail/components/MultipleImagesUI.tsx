import * as React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import FullImage from '../../../components/atoms/FullImage';
import Image from '../../../components/atoms/Image';
import Text from '../../../components/atoms/Text';
import TouchableOpacity from '../../../components/atoms/TouchableOpacity';
import View from '../../../components/atoms/View';
import { renderFile, uniqueKeyExtractor, VALIDATION_CHECK } from '../../../helpers/SharedActions';
import { initColors } from '../../../res/colors';
import constants from '../../../res/constants';


const DEFAULT_IMAGE_SIZE = {
    height: constants.window_dimensions.width * 0.5,
    width: constants.window_dimensions.width * 0.7,
};

interface Props {
    colors?: typeof initColors;
    data?: [];
    isLocal?: boolean;
    height?: number;
    width?: number;
};
const defaultProps = {
    colors: initColors,
    isLocal: false,
    height: DEFAULT_IMAGE_SIZE.height,
    width: DEFAULT_IMAGE_SIZE.width,
};




const MultipleImagesUI = React.memo((props: Props) => {
    const data = props.data ?? [];
    const isLocal = props.isLocal ?? defaultProps.isLocal;

    // #region :: STYLES & THEME START's FROM HERE 
    const colors = props?.colors ?? defaultProps.colors;
    const styles = stylesFunc(colors, props.height, props.width);
    // #endregion :: STYLES & THEME END's FROM HERE     

    const [fullImage, toggleFullImage] = React.useState(false);

    const isMultiple = data.length > 1 ? true : false;
    //@ts-ignore
    const singleImagePath = data.length > 0 ? data[0] : '';

    const newData = data.slice(0, 4);

    // #region :: UI START's FROM HERE 

    if (isMultiple) {
        return (
            <>
                <FlatList
                    data={newData}
                    numColumns={2}
                    style={styles.primaryContainer}
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    keyExtractor={uniqueKeyExtractor}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    padding: 3,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onPress={() => {
                                    toggleFullImage(true);
                                }}>

                                <Image
                                    source={{ uri: isLocal ? item : renderFile(item) }}
                                    style={{
                                        ...(newData.length === 3 && index === newData.length - 1) ? styles.thirdImage : styles.image
                                    }}
                                    tapToOpen={false}
                                />
                                {(index === newData.length - 1 && data.length > 3) &&
                                    <>
                                        <View style={styles.overlay} />
                                        <Text style={styles.overlayText}>{`${(data.length - 4) > 0 ? `+ ${(data.length - 4)}` : ``}  `}</Text>
                                    </>
                                }
                            </TouchableOpacity>
                        )
                    }} />

                {fullImage &&
                    <FullImage
                        data={data.map(i => ({
                            source: { uri: isLocal ? i : renderFile(i) },
                            // text:i?.text??''
                        }))}
                        source={undefined}
                        toggleFullImage={() => {
                            toggleFullImage(false);
                        }}
                    />
                }

            </>
        )
    }
    else if (VALIDATION_CHECK(singleImagePath))
        return (
            <TouchableOpacity style={styles.primaryContainer}>
                <Image
                    source={{ uri: isLocal ? singleImagePath : renderFile(singleImagePath) }}
                    style={styles.singleImage} />
            </TouchableOpacity>
        )
    else return null;

    // #endregion :: UI END's FROM HERE 

}, (n, p) => n !== p);

//@ts-ignore
MultipleImagesUI.defaultProps = defaultProps;
export default MultipleImagesUI;

const BORDER_RADIUS = 13;
const stylesFunc = (colors: typeof initColors = initColors, height = defaultProps.height, width = defaultProps.width,) => {
    const multiHeight = height / 2;
    const multiWidth = width / 2;

    return StyleSheet.create({
        primaryContainer: {
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            padding: 8,
        },
        singleImage: {
            borderTopLeftRadius: BORDER_RADIUS,
            borderTopRightRadius: BORDER_RADIUS,
            margin: 8,
            marginBottom: 4,
            height: height,
            width: width,
            resizeMode: 'cover',
        },

        image: {
            height: multiHeight,
            width: multiWidth,
            borderRadius: BORDER_RADIUS,
        },
        thirdImage: {
            height: multiHeight,
            width: width,
            borderRadius: BORDER_RADIUS,
        },
        overlay: {
            height: multiHeight,
            width: multiWidth,
            borderRadius: BORDER_RADIUS,
            position: "absolute",
            backgroundColor: `rgba(0,0,0,0.39)`,
        },
        overlayText: {
            position: "absolute",
            top: multiHeight / 3,
            alignItems: "center",
            alignSelf: "center",
            textAlign: "center",
            color: colors.white,
            fontSize: 32,
        },
    })
};//end of stylesFunc


