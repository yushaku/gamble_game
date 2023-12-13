import { Flex, HStack, Image, Spacer, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { setActiveMenu } from "../../reduxs/accounts/account.actions";
import { useAppSelector, useAppDispatch } from "../../reduxs/hooks";
import { menus } from "../../utils/constants";
import ConnectWallet from "../ConnectWallet";
import WalletInformation from "../WalletInformation";

export default function Header() {
  const { walletInfo, selectedMenu } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const [isOpenMenu, setOpenMenu] = React.useState<boolean>(false);

  const handleNavigate = (name: string) => {
    dispatch(setActiveMenu(name));
  };

  return (
    <Flex
      w="full"
      h="120px"
      alignItems="center"
      justifyContent="space-between"
      px="20px"
    >
      <HStack position="relative" onClick={() => setOpenMenu(!isOpenMenu)}>
        <Image src="/coin.png" w={{ base: "20px", lg: "35px" }} />
        <Text
          variant="with-title"
          fontSize={{ base: "12px", lg: "25px" }}
          fontWeight="bold"
          ml="10px"
          color="#f6e6b7"
        >
          FLIP COIN
        </Text>
        <Image src="/down.svg" display={{ base: "block", lg: "none" }} />
        {isOpenMenu && (
          <VStack
            display={{ base: "block", lg: "none" }}
            as="ul"
            position="absolute"
            top="30px"
            w="full"
            alignItems="flex-start"
            bg="rgba(255,255,255, 0.2)"
            px="10px"
            borderRadius="5px"
            py="10px"
          >
            {menus.map((menu) => (
              <Flex as="li">
                <Link href={menu.url}>
                  <a>
                    <Text variant="notoSan" fontSize="10px">
                      {menu.name}
                    </Text>
                  </a>
                </Link>
              </Flex>
            ))}
          </VStack>
        )}
      </HStack>

      {/* <Mobile /> */}
      <HStack ml="50px" display={{ base: "none", lg: "flex" }}>
        {menus.map((menu) => (
          <Link href={`${menu.url}`} key={menu.name}>
            <a
              className={selectedMenu === menu.name ? "menu-active" : ""}
              onClick={() => handleNavigate(menu.name)}
            >
              <Text variant="with-title" mx="20px" fontSize="14px">
                {menu.name}
              </Text>
            </a>
          </Link>
        ))}
      </HStack>

      <Spacer />

      {!walletInfo.address && <ConnectWallet />}
      {walletInfo.address && <WalletInformation />}
    </Flex>
  );
}
