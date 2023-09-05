import { View, Text, Linking } from "react-native";

export const PaymentItem = ({ payment }) => {
  return (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "#fff",
        padding: "5",
        flexDirection: 'column',
        rowGap: 20,
        marginVertical: 20,
        paddingVertical: 20
      }}
    >
      <View style={styles.container}>
        <Text style={styles.titleText}>Infos du paiement</Text>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Date : </Text>
          <Text style={styles.text}>
            {new Date(payment.created * 1000).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Montant : </Text>
          <Text style={styles.text}>
            {(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Statut : </Text>
          <Text style={styles.text}>{payment.status}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Description : </Text>
          <Text style={styles.text}>{payment.description || "N/A"}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Reçu : </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(payment.receipt_url)}
          >
            Voir le reçu
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>Facturation</Text>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Nom :</Text>
          <Text style={styles.text}>
            {payment.shipping?.name
              ? payment.shipping.name
              : "Nom non renseigné"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Adresse :</Text>
          <Text style={styles.text}>
            {payment.shipping?.address?.line1
              ? payment.shipping.address.line1
              : "Adresse non renseignée"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Code postal :</Text>
          <Text style={styles.text}>
            {payment.shipping?.address?.postal_code
              ? payment.shipping.address.postal_code
              : "Code postal non renseigné"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Ville & pays :</Text>
          <Text style={styles.text}>
            {payment.shipping?.address?.city
              ? payment.shipping.address.city
              : "Ville non renseignée"}
            ,{" "}
            {payment.shipping?.country
              ? payment.shipping.country
              : "Pays non renseigné"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Ville & pays :</Text>
          <Text style={styles.text}>
            {payment.shipping?.address?.city
              ? payment.shipping.address.city
              : "Ville non renseignée"}
            ,{" "}
            {payment.shipping?.country
              ? payment.shipping.country
              : "Pays non renseigné"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Email :</Text>
          <Text style={styles.text}>
          {payment.email ? payment.email : "Non renseigné"}
          </Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.labelText}>Téléphone :</Text>
          <Text style={styles.text}>
          {payment.phone ? payment.phone : "Non renseigné"}
          </Text>
        </View>

      </View>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "column",
    // rowGap: 20,
    backgroundColor: '#fff',
    marginBottom: 20
  },
  titleText: {
    color: "#2f4f4f",
    fontSize: 19,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginLeft: 20,
    marginBottom: 10
  },
  labelText: {
    color: "#122121",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginLeft: 20,
  },
  text: {
    color: "#122121",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Regular",
    // fontWeight: "600",
    marginLeft: 20,
  },
  link: {
    color: "#122121",
    fontSize: 14,
    fontFamily: "WixMadeforDisplay-Bold",
    fontWeight: "600",
    marginLeft: 20,
    textDecorationLine: 'underline'
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
};
