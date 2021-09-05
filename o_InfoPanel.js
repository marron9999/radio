/*
 * 作成日: 2004/12/18
 *
 */
//import javax.swing.*;
/**
 * @author mori
 * 
 */
const InfoPanel = function() {
	let infoPanel = _InfoPanel_();
	return infoPanel;
}

const _InfoPanel_ = function() {
	return {

//	private JLabel blackLabel;
//	private JLabel whiteLabel;

//	public InfoPanel() {
//		add(new JLabel("BLACK:"));
//		blackLabel = new JLabel("0");
//		add(blackLabel);
//		add(new JLabel("WHITE:"));
//		whiteLabel = new JLabel("0");
//		add(whiteLabel);
//	}

	/**
	 * BLACKラベルに値をセットする。
	 * 
	 * @param count
	 *            セットする数字。
	 * 
	 */
	setBlackLabel : function(count) {
//		blackLabel.setText(count + "");
	},

	/**
	 * WHITEラベルに値をセットする。
	 * 
	 * @param text
	 *            セットする数字。
	 * 
	 */
	setWhiteLabel : function(count) {
//		whiteLabel.setText(count + "");
	}

	};
}

module.exports = { InfoPanel };
