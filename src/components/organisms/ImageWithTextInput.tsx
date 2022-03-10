import * as React from "react";
import { FlatList, Image, ImageSourcePropType, KeyboardAvoidingView, Modal, Platform, TextInput, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import ImageGallery from "../../../libs/ImageGallery";
import svgs from "../../assets/svgs";
import { sharedLaunchCameraorGallery } from "../../helpers/Camera";
import { sharedConfirmationAlert } from "../../helpers/SharedActions";
import { initColors } from "../../res/colors";

import VectorIcon from "../atoms/VectorIcon";

const options = {
    selectionLimit: 0,
    quality: 0.5,
    maxWidth: 1000,
    storageOptions: Platform.select({
        ios: {
            skipBackup: true,
            path: 'images',
        }
    }),
    mediaType: "photo",
};
interface dataProps {
    id?: number | string;
    source?: ImageSourcePropType;
    uri?: string;
    text?: string;
}

interface Props {
    children?: any;
    onSendPress?: (images: dataProps[]) => void;
    onRequestClose?: () => void;
    showPickOption?: boolean;
    color?: typeof initColors;
};

const defaultProps = {
    onSendPress: undefined,
    onRequestClose: undefined,
    showPickOption: false,
    color: initColors,
};
let addFurther = false;

const ImageWithTextInput = (props: Props) => {
    const colors = props?.color ?? defaultProps.color;
    const insets = useSafeAreaInsets();
    const [visible, toggleVisible] = React.useState<boolean>(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    const [images, setImages] = React.useState<dataProps[]>([]);

    React.useEffect(() => {
        if (props.showPickOption) {
            onAttachmentPress();
        }
    }, [props.showPickOption])
    const onAttachmentPress = () => {
        sharedConfirmationAlert("Alert", "Pick Option!", [{
            text: "Choose from Gallery", onPress: () => {
                setImages([]);
                toggleVisible(true);
                sharedLaunchCameraorGallery(0, () => {
                    onModalClose();
                }, (picData: any) => {
                    getPicture(picData);
                }, options);
            }
        }, {
            text: "Open Camera", onPress: () => {
                setImages([]);
                toggleVisible(true);
                sharedLaunchCameraorGallery(1, () => {
                    onModalClose();
                }, (picData: any) => {
                    getPicture(picData);
                }, options);
            }
        }, {
            text: "Cancel", onPress: () => { onModalClose(); }
        }])
    }

    const getPicture = (pic: any) => {
        console.log('getPicture   ', pic);
        if ((pic?.assets ?? []).length > 0) {
            if (addFurther) {
                setImages([...images, ...pic.assets]);
                addFurther = false;
            } else {
                setImages(pic.assets);
            }
            toggleVisible(true);
        } else {
            setImages([]);
            onModalClose();
        }
    }

    const onSendPress = () => {
        if (props.onSendPress) {
            props.onSendPress(images);
            onModalClose();
        }
    };

    const onModalClose = () => {
        props.onRequestClose && props.onRequestClose();
        toggleVisible(false)
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onModalClose}>

            {images.length > 0 ?
                <View style={{ flex: 1, position: "absolute", }}>
                    <ImageGallery
                        style={{ flex: 1, backgroundColor: '#000', }}
                        pageMargin={10}
                        images={images}
                        initialPage={selectedImageIndex}
                        onPageSelected={(num: any) => {
                            if (selectedImageIndex !== num) {
                                setSelectedImageIndex(num);
                            }

                        }}
                    />

                    <VectorIcon
                        name="close"
                        type="AntDesign"
                        color={'#fff'}
                        size={30}
                        style={{
                            position: 'absolute',
                            top: 30,
                            left: 10
                        }}
                        onPress={onModalClose} />

                    {images.length > 1 &&
                        <TouchableOpacity
                            activeOpacity={0}
                            style={{
                                position: 'absolute',
                                top: 30,
                                right: 10
                            }} onPress={() => {
                                const newImages = images.filter((_, i) => i !== selectedImageIndex);
                                if (selectedImageIndex > 0)
                                    setSelectedImageIndex(selectedImageIndex - 1);
                                else
                                    setSelectedImageIndex(0);
                                setImages(newImages);
                            }} >
                            <VectorIcon
                                name="delete"
                                type="MaterialCommunityIcons"
                                color={'#fff'}
                                size={30}
                            />
                        </TouchableOpacity>
                    }
                </View>
                :
                <View style={{ flex: 1, backgroundColor: '#000' }} />
            }
            <KeyboardAvoidingView behavior={Platform.OS === "android" ? undefined : "padding"} style={{
                flexGrow: 0,
                flex: 0,
                backgroundColor: "#000",
                position: "absolute",
                bottom: 0,
                paddingTop: 10,
                paddingBottom: Platform.OS === "android" ? 10 : 0,
                width: "100%",
            }} contentContainerStyle={{ flexGrow: 0, }}>
                {images.map((item, index) => {
                    if (index !== selectedImageIndex) return null
                    return (
                        <View key={index} style={{
                            backgroundColor: '#fff',
                            flexDirection: "row",
                            alignItems: "center",
                            minHeight: 44,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            marginHorizontal: 10,
                            marginBottom: Platform.OS === "ios" ? images.length < 2 ? insets.bottom : 0 : 0,
                        }}>
                            <TouchableOpacity onPress={() => {
                                addFurther = true;
                                onAttachmentPress();
                            }} style={{ marginRight: 6, }}>
                                <VectorIcon name="ios-images" size={23} />
                            </TouchableOpacity>

                            <TextInput
                                placeholder="Type something..."
                                style={{
                                    flex: 1,
                                }}

                                autoCorrect={false}
                                returnKeyType="send"
                                returnKeyLabel="send"
                                defaultValue={item?.text ?? ''}
                                onChangeText={(va) => { images[selectedImageIndex].text = va; }}
                                onSubmitEditing={onSendPress}
                            />
                            <TouchableOpacity onPress={onSendPress}>
                                <SvgXml
                                    xml={svgs.order_chat_send(colors.primary, 1)}
                                    height={23}
                                    width={23}
                                />
                            </TouchableOpacity>

                        </View>
                    )
                }
                )}

                {images.length > 1 &&
                    <FlatList
                        data={images}
                        style={{ flexGrow: 0, backgroundColor: '#000', }}
                        horizontal
                        renderItem={({ item, index }) => {
                            const path = "source" in item ? item.source : { uri: item.uri };
                            if (path)
                                return (
                                    <TouchableOpacity
                                        disabled={index === selectedImageIndex}
                                        onPress={() => {
                                            setSelectedImageIndex(index);
                                        }}
                                        style={{
                                            marginLeft: index === 0 ? 10 : 8,
                                            marginVertical: 16,
                                            borderColor: "#fff",
                                            borderWidth: index === selectedImageIndex ? 1 : 0,
                                            borderRadius: 8,
                                        }}>
                                        <Image source={path} style={{
                                            height: 50,
                                            width: 50,
                                            resizeMode: "cover",
                                            borderRadius: 8,
                                        }} />
                                    </TouchableOpacity>
                                )
                            return null
                        }} />
                }
            </KeyboardAvoidingView>
        </Modal>
    );
}

ImageWithTextInput.defaultProps = defaultProps;
export default ImageWithTextInput;
