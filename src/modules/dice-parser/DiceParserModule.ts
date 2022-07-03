import {Client, Message} from "discord.js";
import {DiceRoller, DiscordRollRenderer} from "dice-roller-parser";
import AbstractModule from "../../module/AbstractModule";

export default class DiceParserModule extends AbstractModule {
    private renderer = new DiscordRollRenderer();
    private diceRoller = new DiceRoller();

    attach(): void {
        this.client.on("messageCreate", this.listener)
    }

    detach(): void {
        this.client.off("messageCreate", this.listener)
    }

    getConfigName(): string {
        return "diceParserConfig.json";
    }

    isEnabled(): boolean {
        return !!this.config && !!this.config.enabled;
    }

    private listener = async (msg: Message) => await this.parseRoll(this.client, msg);

    async parseRoll(client: Client, msg: Message) {
        if(!msg.content.startsWith("$roll")) return;

        const content = msg.content.replace("$roll", "").trim()

        try {
            const rollObject = this.diceRoller.roll(content);
            await msg.reply(this.renderer.render(rollObject))
        } catch (e) {
            await msg.reply("https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference#DiceReference-TypesOfDice")
        }
    }




}