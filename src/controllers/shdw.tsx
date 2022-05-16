import React, { useEffect } from "react";
import * as anchor from "@project-serum/anchor";
import ShdwDrive from "@shadow-drive/sdk";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export default function Drive() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    useEffect(() => {
        (async () => {
            if (wallet?.publicKey) {
                const drive = await new ShdwDrive(connection, wallet as AnchorWallet).init();
            }
        })();
    }, [wallet?.publicKey])
    return (
        <div></div>
    )
}