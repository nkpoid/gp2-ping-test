import sys
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv(sys.argv[1])
x = df['UNIXTIME']

fig, ax1 = plt.subplots(1, 1)

labels = ['DEFAULT_GATEWAY_RTT', 'GOOGLE_PUBLIC_DNS_RTT']
for label in labels:
    ax1.plot(x, df[label], label=label)

ax1.set_ylabel('RTT')
ax1.tick_params(labelbottom=False, bottom=False)
ax1.legend(loc='upper right')

ax2 = ax1.twinx()
ax2.bar(x, df['QoE'], width=1.0, color='lightblue')
ax2.grid()
ax2.set_ylabel('QoE')
ax2.set_ylim(0, 5)
ax2.tick_params(labelbottom=False, bottom=False)

ax1.set_zorder(2)
ax2.set_zorder(1)
ax1.patch.set_alpha(0)
fig.tight_layout()
plt.show()
